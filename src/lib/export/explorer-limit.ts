export const EXPLORER_EXPORT_LIMIT = 10_000;

export class ExplorerExportLimitError extends Error {
  constructor() {
    super("explorer_export_limit");
  }
}

export function assertExplorerExportLimit(totalCount: number): void {
  if (totalCount > EXPLORER_EXPORT_LIMIT) throw new ExplorerExportLimitError();
}
