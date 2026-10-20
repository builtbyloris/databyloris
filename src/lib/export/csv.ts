type CsvCell = string | number | boolean | null | undefined;

function escapeCell(value: CsvCell): string {
  const text = value === null || value === undefined ? "" : String(value);
  // Spreadsheet applications may evaluate formulas even inside quoted CSV cells.
  const safe = /^[\s\uFEFF]*[=+\-@]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function createCsv(headers: string[], rows: CsvCell[][]): string {
  return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n")}\r\n`;
}

export function csvDownloadResponse(csv: string, fileName: string): Response {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
