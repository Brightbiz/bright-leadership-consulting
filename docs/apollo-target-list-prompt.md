# Apollo Target List Prompt — Bright Leadership Consulting

## Purpose
Generate a focused list of UK board-level contacts who are plausible buyers or introducers for the **Executive Alignment Index™ (EAI)** — a board-level governance diagnostic for executive team alignment.

---

## Apollo Prompt (copy-paste into Apollo AI Prospector / list builder)

```
Find UK-based Chairs, Senior Independent Directors (SIDs), and Nominations Committee chairs at organisations where board-level executive alignment is a governance priority.

Target roles: Chair, Senior Independent Director, Nominations Committee Chair, Board Member with governance/remit focus, Head of Board Effectiveness, Company Secretary at FTSE 250 / FTSE 350 / large private / PE-backed firms.

Target company profile:
- UK headquartered or with significant UK board presence
- Revenue £250M+ or enterprise value £500M+
- Listed on LSE (FTSE 350 preferred), large private companies, or PE-backed portfolios
- Sectors of interest: financial services, infrastructure, healthcare, professional services, industrials, technology at scale
- Boards that have recently undergone refresh, CEO transition, strategy disagreement, or governance review

Exclusions:
- Non-UK roles unless they sit on a UK board
- Junior executives, operational managers, or non-board HR/L&D leads
- Companies below £250M revenue / £500M EV
- Pure startup/scale-up environments (Series A/B unless already FTSE-bound)
- Competitors or executive coaching marketplaces

Required output fields:
Full Name, Job Title, Company Name, Company Website, LinkedIn URL, Email (verified), Phone (if available), Company Size, Industry, Location, Seniority Level, Department, Any listed board committees.

List size: 50–100 contacts, ranked by seniority and company relevance.
```

---

## Follow-up enrichment prompt (after first list is generated)

```
For each contact above, enrich with:
- Recent board changes or appointments at the company
- Known governance challenges, CEO transitions, or strategy reviews in the last 24 months
- Whether the company has a published board effectiveness review or annual report language about "alignment," "culture," or "board dynamics"
- Suggested personalised context line for outreach referencing the EAI™
```

---

## How this feeds the outreach generator

The generator accepts Apollo's exported CSV directly — no manual reformatting required.

### Supported Apollo columns (auto-mapped)

| Apollo column(s) | Maps to |
|------------------|---------|
| `Name`, `Full Name`, `First Name` + `Last Name` | Recipient name |
| `Title`, `Job Title`, `Role` | Role |
| `Company Name`, `Company`, `Account Name`, `Organization Name`, `Organisation` | Company |
| `Industry`, `Keywords`, `Company Industry` | Pre-filled context (editable after import) |

Any columns the generator does not recognise are ignored. Columns with empty values are skipped.

### Steps

1. In Apollo, select your list and choose **Export → CSV**.
2. Go to **/admin/outreach**.
3. Click **Upload Apollo CSV**, select the file, and confirm the preview.
4. Add or edit the **Context** field for each imported row (this is where you paste the personalised line from the enrichment prompt).
5. Click **Generate drafts**.

If you prefer, you can still paste rows manually in the format:

```
Name | Role | Company | Context
```

---

## Recommended Apollo search settings

- **Location:** United Kingdom
- **Seniority:** C-Level, VP, Director, Board Member
- **Department:** Operations, Finance, Legal/Governance, General Management
- **Headcount:** 1,000+
- **Revenue:** £250M+
- **Keywords in title:** Chair, Senior Independent Director, Nominations, Board, Governance, Company Secretary
