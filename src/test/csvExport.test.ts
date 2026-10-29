import { describe, expect, it } from "vitest";
import { escapeCsvCell, serialiseCsv } from "@/lib/csvExport";

describe("CSV export safety", () => {
  it.each(["=1+1", "+SUM(1,2)", "-1+1", "@SUM(1,2)", "  =1+1", "\t=1+1", "\r\n+1", "\u0000-1", " \u001f@SUM(1)", "\u007f=1", "\u0085=1", "\u00a0=1"])(
    "neutralises formula-leading value %j without trimming it", (value) => {
      expect(escapeCsvCell(value)).toBe(`"'${value}"`);
    },
  );
  it.each(["\tordinary", "\rordinary", "\nordinary", " \u0000ordinary"])(
    "neutralises a leading control character %j", (value) => {
      expect(escapeCsvCell(value)).toBe(`"'${value}"`);
    },
  );
  it("escapes quotes and commas after neutralising a formula", () => {
    expect(escapeCsvCell('=HYPERLINK("https://example.invalid","text")')).toBe(
      '"\'=HYPERLINK(""https://example.invalid"",""text"")"',
    );
  });
  it.each(["ordinary text", "  ordinary text", "user@example.invalid", "1+1", "", "'text"])(
    "preserves ordinary value %j", (value) => {
      expect(escapeCsvCell(value)).toBe(`"${value}"`);
    },
  );
  it("retains normal quote escaping and embedded line breaks", () => {
    expect(escapeCsvCell('A "quoted", name\nsecond line')).toBe('"A ""quoted"", name\nsecond line"');
  });
  it("protects every column and does not mutate source records", () => {
    const row = Object.freeze(["=1+1", 'ordinary "text"', "  +2"]);
    const rows = Object.freeze([row]);
    expect(serialiseCsv(["Name", "Notes", "Phone"], rows)).toBe(
      '"Name","Notes","Phone"\n"\'=1+1","ordinary ""text""","\'  +2"',
    );
    expect(row).toEqual(["=1+1", 'ordinary "text"', "  +2"]);
  });
});