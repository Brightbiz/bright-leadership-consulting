/** Export-only protection: never trim or change the original stored value. */
export function escapeCsvCell(value: string): string {
  const leading = value.match(/^[\s\u0000-\u001f\u007f-\u009f]*/u)?.[0] ?? "";
  const formulaLeading = /^[=+\-@]/.test(value.slice(leading.length));
  const controlLeading = /[\u0000-\u001f\u007f-\u009f]/.test(leading);
  const text = formulaLeading || controlLeading ? `'${value}` : value;
  return `"${text.replace(/"/g, '""')}"`;
}

export function serialiseCsv(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
}