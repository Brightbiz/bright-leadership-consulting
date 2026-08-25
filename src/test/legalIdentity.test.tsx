import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { readFileSync } from "node:fs";
import Footer from "@/components/Footer";
import OrganizationSchema from "@/components/OrganizationSchema";

/**
 * Legal-identity regression tests.
 *
 * Confirmed identity: "Irene A. Agunbiade trading as Bright Leadership
 * Consulting" — restricted to legal, transactional and regulatory
 * documentation. On the website it is approved ONLY in the Terms contracting
 * and invoicing provisions and the Privacy data-controller provision.
 * Public-facing branding remains "Bright Leadership Consulting".
 */

const readSource = (path: string) => readFileSync(path, "utf8");

const TERMS = readSource("src/pages/Terms.tsx");
const PRIVACY = readSource("src/pages/Privacy.tsx");

const PROHIBITED_ENTITY = [
  /bright\s+business\s+solutions/i,
  /07\s?258\s?400/,
  /\bcompany\s+(number|no\.?)\b/i,
  /\bregistration\s+number\b/i,
  /\bregistered\s+(office|in\s+england)/i,
  /\bcompanies\s+house\b/i,
  /\bwenlock\s+road\b/i,
  /\bN1\s?7GU\b/i,
  /\bcompany\s+limited\b/i,
  /\blimited\s+company\b/i,
  /\bLtd\b/,
];

const IDENTITY_WORDING =
  /(trading\s+as\s+bright\s+leadership\s+consulting|under\s+the\s+business\s+name\s+bright\s+leadership\s+consulting|\bsole\s+trader\b|\bproprietor\b)/i;

const readBlocks = () =>
  Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).map((el) =>
    JSON.parse(el.textContent || "{}")
  );

const renderSchema = async () => {
  render(
    <HelmetProvider>
      <OrganizationSchema />
    </HelmetProvider>
  );
  for (let i = 0; i < 40; i++) {
    const blocks = readBlocks();
    if (blocks.length > 0) return blocks;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error("no JSON-LD was emitted");
};

const deepKeys = (value: unknown, out: string[] = []): string[] => {
  if (Array.isArray(value)) value.forEach((v) => deepKeys(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      out.push(k);
      deepKeys(v, out);
    }
  }
  return out;
};

const deepValues = (value: unknown, out: string[] = []): string[] => {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => deepValues(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => deepValues(v, out));
  return out;
};

beforeEach(() => {
  cleanup();
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove());
});

describe("prohibited former-entity wording", () => {
  const files = [
    "src/components/Footer.tsx",
    "src/components/OrganizationSchema.tsx",
    "src/components/CourseSchema.tsx",
    "src/pages/Terms.tsx",
    "src/pages/Privacy.tsx",
    "src/pages/Index.tsx",
    "src/pages/Principal.tsx",
    "src/pages/Courses.tsx",
    "src/pages/Contact.tsx",
    "index.html",
  ];

  it.each(files)("%s contains no former-company or registered-office wording", (file) => {
    const source = readSource(file);
    for (const pattern of PROHIBITED_ENTITY) {
      expect(source, `${file} matched ${pattern}`).not.toMatch(pattern);
    }
  });
});

describe("restricted identity placement", () => {
  it("Terms carries the identity only in contracting and invoicing provisions", () => {
    expect(TERMS).toMatch(
      /contracting and invoicing party for all engagements, programmes and purchases is Irene A\. Agunbiade trading as Bright Leadership Consulting/
    );
    expect(TERMS).toMatch(/Invoices are issued by Irene A\. Agunbiade trading as Bright Leadership Consulting/);
    const matches = TERMS.match(/Irene A\. Agunbiade/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("Privacy carries the identity only in the data-controller provision", () => {
    expect(PRIVACY).toMatch(
      /data controller is Irene A\. Agunbiade, operating under the business name Bright Leadership Consulting/
    );
    expect(PRIVACY.match(/Irene A\. Agunbiade/g) ?? []).toHaveLength(1);
  });

  it.each([
    "src/components/Footer.tsx",
    "src/components/Header.tsx",
    "src/components/OrganizationSchema.tsx",
    "src/components/CourseSchema.tsx",
    "src/pages/Index.tsx",
    "src/pages/Principal.tsx",
    "src/pages/Courses.tsx",
    "src/pages/Contact.tsx",
    "src/pages/AdvisoryProcess.tsx",
    "src/pages/ExecutiveAlignmentIndex.tsx",
    "src/pages/ExecutiveLeadershipMastery.tsx",
    "src/pages/StrategicLeadershipAI.tsx",
    "src/pages/StrategicAiLeadershipOrganisations.tsx",
    "src/pages/AugmentedLeadership.tsx",
    "index.html",
  ])("%s carries no proprietor or sole-trader wording", (file) => {
    expect(readSource(file)).not.toMatch(IDENTITY_WORDING);
  });

  it("data-controller wording appears only in the Privacy Notice", () => {
    expect(PRIVACY).toMatch(/data controller/i);
    for (const file of ["src/pages/Terms.tsx", "src/components/Footer.tsx", "src/pages/Index.tsx"]) {
      expect(readSource(file)).not.toMatch(/\bdata controller\b/i);
    }
  });
});

describe("footer", () => {
  it("shows public branding, the descriptor and a correspondence address only", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText("Bright Leadership Consulting")).toBeInTheDocument();
    expect(screen.getByText("Principal-led executive advisory and development")).toBeInTheDocument();
    expect(
      screen.getByText("Correspondence address: 82 James Carter Road, Mildenhall, England IP28 7DE.")
    ).toBeInTheDocument();

    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(IDENTITY_WORDING);
    for (const pattern of PROHIBITED_ENTITY) expect(text).not.toMatch(pattern);
  });
});

describe("Mildenhall address labelling", () => {
  it.each(["src/components/Footer.tsx", "src/pages/Terms.tsx", "src/pages/Privacy.tsx"])(
    "%s labels the address as a correspondence address",
    (file) => {
      for (const line of readSource(file).split("\n")) {
        if (/82 James Carter Road/i.test(line)) {
          expect(line, file).toMatch(/Correspondence (and service )?address/i);
        }
      }
    }
  );
});

describe("Organisation JSON-LD", () => {
  it("uses public branding with no legal or registration identifiers", async () => {
    const [graph] = await renderSchema();
    const nodes = graph["@graph"] as Record<string, unknown>[];
    const org = nodes.find((n) =>
      Array.isArray(n["@type"]) ? (n["@type"] as string[]).includes("Organization") : n["@type"] === "Organization"
    )!;

    expect(org.name).toBe("Bright Leadership Consulting");
    expect(org.founder).toEqual({
      "@type": "Person",
      name: "Irene A. Agunbiade",
      jobTitle: "Principal",
    });

    const keys = deepKeys(graph);
    for (const key of ["legalName", "taxID", "vatID", "duns", "leiCode", "registrationNumber", "identifier"]) {
      expect(keys, `JSON-LD must not include ${key}`).not.toContain(key);
    }

    const values = deepValues(graph).join(" ");
    expect(values).not.toMatch(IDENTITY_WORDING);
    for (const pattern of PROHIBITED_ENTITY) expect(values).not.toMatch(pattern);

    const address = org.address as Record<string, string>;
    expect(address.streetAddress).toBe("82 James Carter Road");
    expect(address.addressCountry).toBe("GB");
  });
});
