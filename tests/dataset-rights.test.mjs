import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import test from "node:test";
import {fileURLToPath} from "node:url";
import {runInNewContext} from "node:vm";
import ts from "typescript";

const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../src/lib/datasets/rights.ts"), "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
const compiledExports = {};
runInNewContext(compiled, {
  exports: compiledExports,
  require: (name) => {
    if (name !== "@/lib/urls") throw new Error(`Unexpected import: ${name}`);
    return {isSafeExternalUrl: (value) => {
      try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
    }};
  },
});
const {emptyDatasetRights, isReviewedRights, validRightsInput, validFieldAllowlist, dashboardReferencedFields, potentiallyIdentifyingFields} = compiledExports;

const gateSource = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../src/lib/admin/publishing-quality-gate.ts"), "utf8");
const gateCompiled = ts.transpileModule(gateSource, {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
const gateExports = {};
runInNewContext(gateCompiled, {
  exports: gateExports,
  require: (name) => {
    if (name === "@/lib/datasets/rights") return compiledExports;
    if (name === "@/lib/datasets/field-names") return {normalizeDatasetFieldName: (value) => value, resolveDatasetFieldName: (value, fields) => fields.includes(value) ? value : null};
    if (name === "@/lib/project-media") return {isProjectCoverStoragePath: () => true};
    if (name === "@/lib/urls") return {isSafeExternalUrl: (value) => value.startsWith("https://")};
    if (name === "./dashboard-validation") return {validateDashboardConfig: () => []};
    throw new Error(`Unexpected import: ${name}`);
  },
});

function reviewed(licenseType = "cc0") {
  return {...structuredClone(emptyDatasetRights), sourceAuthor: "Source", sourceUrl: "https://example.org/data",
    dataPeriod: "2016", licenseType, licenseUrl: "https://example.org/license", licenseVersion: "1.0",
    licenseCheckedAt: "2026-10-24", reviewStatus: "verified", confirmed: true,
    privacy: {personalData: true, directIdentifiers: true, quasiIdentifiers: true, fieldReview: true}};
}

test("verified open licence still requires source, licence and explicit privacy confirmation", () => {
  const rights = reviewed();
  assert.equal(validRightsInput(rights), true);
  assert.equal(isReviewedRights(rights), true);
  assert.equal(isReviewedRights({...rights, confirmed: false}), false);
  assert.equal(isReviewedRights({...rights, licenseUrl: ""}), false);
  assert.equal(validRightsInput({...rights, sourceUrl: "javascript:alert(1)"}), false);
});

test("non-CC0 licences require documented manual review", () => {
  for (const licenseType of ["cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nd", "odbl", "unknown", "custom", "competition-rules"]) {
    const rights = reviewed(licenseType);
    assert.equal(isReviewedRights(rights), false);
    assert.equal(isReviewedRights({...rights, reviewNotes: "Manual terms review documented."}), true);
  }
});

test("allowlists reject private or duplicated fields and dashboard references stay distinct", () => {
  const columns = [{name: "price_usd", type: "number", nullable: false}, {name: "host_id", type: "string", nullable: false}];
  assert.equal(validFieldAllowlist(["price_usd"], columns), true);
  assert.equal(validFieldAllowlist(["hidden"], columns), false);
  assert.equal(validFieldAllowlist(["price_usd", "price_usd"], columns), false);
  assert.deepEqual(Array.from(dashboardReferencedFields({filters: [], kpis: [{field: "price_usd"}], charts: [], rankings: []})), ["price_usd"]);
  assert.deepEqual(Array.from(potentiallyIdentifyingFields(columns)), ["host_id"]);
  assert.deepEqual(Array.from(potentiallyIdentifyingFields([{name: "id"}, {name: "review_scores_rating"}])), ["id"]);
});

test("legacy exemption applies only to a project that was already published", () => {
  const local = {it: "Present", en: "Present"};
  const dataset = {rights: structuredClone(emptyDatasetRights), rightsLegacy: true, explorerEnabled: true,
    explorerFields: ["metric"], dashboardFields: [], dashboardPublicEnabled: false, csvExportEnabled: false,
    columns: [{name: "metric", type: "number", nullable: false}], dictionary: {
      metric: {label: local, description: local},
    }};
  const input = {project: {id: "fixture", slug: "fixture", title: local, description: local,
    category: "Analysis", status: "published", dashboardAvailable: false, featured: false},
  imagePath: "fixture", detail: {context: local, objective: local,
    dataset: {name: "Dataset", source: local, description: local},
    methodology: [{title: local, description: local}], insights: [{description: local}]},
  dataset, datasetCount: 1, config: null};
  const draftTransition = gateExports.evaluatePublishingQuality({...input, previouslyPublished: false});
  const existingPublished = gateExports.evaluatePublishingQuality({...input, previouslyPublished: true});
  assert.equal(draftTransition.issues.some((issue) => issue.code === "rightsReview"), true);
  assert.equal(existingPublished.issues.some((issue) => issue.code === "rightsReview"), false);
  assert.equal(existingPublished.warnings.some((issue) => issue.code === "rightsReview"), true);
});
