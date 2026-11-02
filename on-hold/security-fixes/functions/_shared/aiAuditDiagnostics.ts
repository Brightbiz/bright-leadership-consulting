/** Staged diagnostic-only logging. Never emit error messages or arbitrary properties. */
const DATABASE_CODES = new Set(["23505", "23502", "23503", "23514", "42501", "40001", "40P01", "57014", "PGRST202", "PGRST204"]);

export function recordFailureDiagnostic(error: unknown) {
  let code = "unknown";
  try {
    const candidate = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (typeof candidate === "string" && DATABASE_CODES.has(candidate)) code = candidate;
  } catch {
    // Even an error with a throwing property must not change the response path.
  }
  return { event: "ai_audit:record_failed", code };
}

export function unexpectedFailureDiagnostic(error: unknown) {
  // Choose literal labels from native types; Error.name is mutable and untrusted.
  let name = "unknown";
  try {
    if (error instanceof SyntaxError) name = "SyntaxError";
    else if (error instanceof TypeError) name = "TypeError";
    else if (error instanceof RangeError) name = "RangeError";
    else if (error instanceof ReferenceError) name = "ReferenceError";
    else if (error instanceof URIError) name = "URIError";
    else if (error instanceof Error) name = "Error";
  } catch {
    // A malformed thrown object never exposes its contents to logs.
  }
  return { event: "ai_audit:unexpected_error", name };
}