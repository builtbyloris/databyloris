export type RepositoryErrorCode = "database" | "duplicate_slug" | "invalid_data" | "not_found";

export class RepositoryError extends Error {
  constructor(public readonly code: RepositoryErrorCode) {
    super(code);
    this.name = "RepositoryError";
  }
}
