# Bright Leadership Consulting — Complete Layout & Design Specification

> For developer handoff — rebuild on any framework or CMS.
> Generated: 2026-03-21

---

## 1. Design Philosophy

**Aesthetic:** Board-pack clarity + Strategy-firm polish.
**References:** Strategy&, The Economist, Stripe, IDEO, Bridgewater Associates.
**Rules:**
- Strictly white backgrounds — no dark mode, no tinted panels
- Zero stock photos, icons, or decorative graphics
- Two subtle monochrome architectural photos used at very low opacity (4–6%) as textural anchors only
- No gradients on the website (gradients reserved for offline assets only)
- No Red/Amber/Green (RAG) colour coding
- Must pass the "Boardroom Test" — appropriate if printed in a confidential board meeting pack

---

## 2. Colour Palette

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Foreground** (Charcoal) | `#1F1F1F` | `0 0% 12%` | All body text, headings |
| **Background** | `#FFFFFF` | `0 0% 100%` | All page backgrounds |
| **Primary** (Muted Teal) | `#1F5C63` | `186 52% 25%` | Links, accent rules, highlights, CTA hover |
| **Muted Foreground** | `#666666` | `0 0% 40%` | Secondary/body text |
| **Border** (Light Grey) | `#E6E6E6` | `0 0% 90%` | All dividers, card borders |
| **Muted Surface** | `#F7F7F7` | `0 0% 97%` | Reserved (currently unused on site) |
| **Accent Gold** | `#C9A227` | `38 92% 55%` | Offline/presentation assets only |

### Extended Teal Scale (EAI Dashboard)
| Token | HSL |
|-------|-----|
| teal-50 | `186 30% 97%` |
| teal-100 | `186 25% 92%` |
| teal-500 | `186 45% 35%` |
| teal-600 | `186 52% 25%` |
| teal-700 | `186 55% 20%` |
| teal-900 | `186 60% 12%` |

---

## 3. Typography

### Fonts
- **Display/Headings:** Libre Baskerville (serif) — Google Fonts
- **Body/UI:** Inter (sans-serif) — Google Fonts

### Scale

| Class | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `heading-hero` | 42px / 48px (lg) | 600 (semibold) | 1.15 | 0.02em | Homepage hero H1 |
| `heading-section` | 28px / 32px (lg) | 600 (semibold) | 1.25 | 0.02em | Section H2s |
| `heading-sub` | 20px / 22px (lg) | 500 (medium) | 1.4 | 0.02em | Sub-headings |
| `body-brief` | 18px | 400 (normal) | 1.65 | default | Main body copy |
| `kicker` | 12px | 500 (medium) | default | 0.2em | Eyebrow labels, uppercase |
| `emphasis-line` | 24px / 28px (lg) | 600 (semibold) | snug | 0.02em | Pull-quote emphasis, serif |
| Nav links | 14px | 400 (normal) | default | 0.03em | Header navigation |
| Footer text | 14px | 400 (normal) | default | 0.05em | Footer links |
| Dashboard labels | 9–11px | 600 (semibold) | default | 2.5px | EAI dashboard section headers |

### Heading Rules
- All `h1`–`h6` use Libre Baskerville
- Body text uses Inter
- Letter spacing on all headings: `0.02em`

---

## 4. Layout System

### Container
- **Max width:** 1140px
- **Horizontal padding:** 32px (mobile) → 64px (md) → 80px (lg)
- **Centred** with `margin: 0 auto`

### Reading Column
- **Max width:** 680px (`.prose-narrow`)
- Used for all focused text blocks (hero, strategic insight, commissioning context)

### Section Spacing
- Standard vertical padding: 100px
- Hero: 160px top and bottom
- Advisory pathway: 90px
- Instrument section: 120px

### Section Dividers
- Thin horizontal rule, 1px height
- Colour: `#E6E6E6` (border token)
- Max width: 680px, centred
- Placed between every major homepage section

---

## 5. Logo

### Typographic Wordmark (no graphic/icon)
- Font: Libre Baskerville
- **"Bright"**: Bold, 1.35rem (21.6px), letter-spacing 0.035em
- **"Leadership Consulting"**: Normal weight, 0.88rem (14.1px), 70% opacity, letter-spacing 0.025em

### Variants
| Variant | Layout | Gap |
|---------|--------|-----|
| **Header** (horizontal) | Baseline-aligned, single row | 0.4em between words |
| **Footer** (stacked) | Vertically stacked | 0.35em between lines |

### Scroll Behaviour
- Default height: 80px nav bar
- Scrolled (>50px): shrinks to 64px; "Bright" reduces to 1.15rem, descriptor to 0.78rem

---

## 6. Header / Navigation

### Structure
- **Fixed** position, full width, top: 0, z-index: 50
- Background: white with 95% opacity + backdrop blur on scroll
- Bottom border: 1px solid border colour (40% opacity default, full on scroll)
- Shadow on scroll: `0 1px 2px rgba(0,0,0,0.04)`

### Navigation Items (Desktop)
Only **3 items** — deliberate restraint:
1. `Executive Alignment Index™` → `/executive-alignment-index`
2. `Selected Engagements` → `/selected-engagements`
3. `Enquire Confidentially` → `/contact` (outlined button)

- Gap between items: 44px (`gap-11`)
- Gap between logo and first nav item: 48px (implicit from justify-between)
- Font: 14px, weight 400, tracking 0.03em
- Active state: weight 500, full foreground colour
- Inactive state: muted foreground colour

### CTA Button (Header)
- Outlined style: 1px border at 20% foreground opacity
- Padding: 20px horizontal, 8px vertical
- Hover: border and text change to primary (teal)
- Border radius: 2px (`rounded-sm`)
- Font weight: 500, tracking 0.03em

### Mobile
- Hamburger icon (Menu/X from Lucide, 20×20px)
- Slide-down overlay: white background, full-width, below header
- Links stacked vertically, 24px gap, 32px padding
- CTA becomes full-width button

---

## 7. Homepage Layout (5 Sections)

### Section 1: Hero

```
┌──────────────────────────────────────────────────┐
│ [Architectural image, right half, 6% opacity]    │
│                                                  │
│  ┃ Executive Alignment Rarely                    │
│  ┃ Breaks. It Drifts.                           │
│  ┃                                               │
│  (2px teal vertical accent rule, left of H1)     │
│                                                  │
│  Body paragraph 1                                │
│  Body paragraph 2                                │
│                                                  │
│  [Enquire Confidentially] [EAI™]                │
│                                                  │
└──────────────────────────────────────────────────┘
```

- **Padding:** 160px top and bottom
- **H1:** `heading-hero` (42–48px serif)
- **Accent rule:** 2px wide, primary teal, left of headline, animated from scaleY(0)→1
- **Body text:** `body-brief` (18px), 8px spacing above, 20px between paragraphs
- **CTAs:** Two outlined buttons side-by-side, 16px gap, 40px above
- **Background image:** Monochrome architectural photo, right half only (lg+), 6% opacity, gradient fade from left (white → transparent)
- **Animation:** Fade-up on headline (0.6s), body (0.15s delay), CTAs (0.3s delay)

### Section 2: Strategic Insight

```
─── (680px divider) ───

  Strategy Slows Before It Fails

  Body paragraph...

  ┃ Strategic interpretation diverges.
  ┃ Decision rights overlap.
  ┃ Escalation becomes inconsistent.

  Performance rarely collapses overnight.

  It drifts.

  Structural alignment must be measured
  — not assumed.

─── (680px divider) ───
```

- **Background:** White (`.section-tinted` resolves to white)
- **Padding:** 80px vertical
- **Heading:** `heading-section` (28–32px)
- **Scan list:** Left border 2px solid border colour, 24px left padding, 8px vertical spacing between items
- **Emphasis lines:** Serif, 24–28px, semibold, 12px vertical padding (pull-quote style)
- **Animation:** Staggered children (0.12s interval), each fading up 12px

### Section 3: The Instrument (Two-Column)

```
─── (680px divider) ───

┌─────────────────────┬────────────────────────────┐
│ THE INSTRUMENT      │                            │
│ (kicker, 12px)      │  ┌──────────────────────┐  │
│                     │  │ EAI Dashboard Preview │  │
│ Executive Alignment │  │ (full component)      │  │
│ Index™              │  └──────────────────────┘  │
│                     │                            │
│ Body paragraphs...  │  ┌──────────────────────┐  │
│                     │  │ Alignment Framework   │  │
│ ┃ Strategic Interp. │  │ Diagram               │  │
│ ┃ Decision Rights   │  └──────────────────────┘  │
│ ┃ Cross-Functional  │                            │
│ ┃ Escalation        │                            │
│ ┃ Accountability    │                            │
│ ┃ Risk Ownership    │                            │
│                     │                            │
│ → EAI™ link         │                            │
│ (sticky left col)   │                            │
└─────────────────────┴────────────────────────────┘
```

- **Padding:** 120px vertical
- **Grid:** 12-column, left=5 cols, right=7 cols, 64px gap
- **Left column:** Sticky (`top: 96px`), contains kicker → heading → body → scan-list → link
- **Right column:** Dashboard preview + Framework diagram, 64px vertical gap between them
- **Background anchor:** Monochrome architectural image, left third, 4% opacity, CSS mask fading right
- **Caption text:** 12px italic, muted foreground, 12px below each visual
- **Responsive:** Stacks to single column below `lg`

### Section 4: Advisory Pathway (Three-Column)

```
─── (680px divider) ───

  A Structured Path to Sustained
  Strategic Execution

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ EAI™     │  │ ALIGN™   │  │ Executive│
  │ Measure  │  │ Install  │  │ Oversight│
  │ variance │  │ clarity  │  │ Sustain  │
  └──────────┘  └──────────┘  └──────────┘

  ┌──────────────────────────────────────┐
  │ Engagement Model Diagram             │
  │ Phase 1 ──→ Phase 2 ──→ Phase 3     │
  └──────────────────────────────────────┘
```

- **Padding:** 90px vertical
- **Heading:** Centred, `heading-section`, 64px below
- **Cards grid:** 3 columns (md+), 48–64px gap
- **Card content:** Serif title (18px medium) + body (16px muted), no borders or backgrounds
- **Animation:** Staggered cards (0.15s interval each, starting at 0.15s)
- **Diagram:** 80px below cards, max-width 768px, centred

### Section 5: Commissioning Context

```
─── (680px divider) ───

  When Executive Alignment Becomes
  a Strategic Priority

  ┃ Strategic planning cycles
  ┃ Leadership transitions
  ┃ AI transformation initiatives
  ┃ Post-acquisition integration
  ┃ Rapid organisational growth

  Typically commissioned by CEOs, Chairs,
  Non-Executive Directors, and CPOs.

  Engagements are confidential and
  calibrated to organisational complexity.

  [Enquire Regarding Executive Alignment]

────────────────────────────────────────

  (Credibility reinforcement line, centred,
   14px muted, max 680px)
```

- **Padding:** 90px vertical, centred text
- **Scan list:** Centre-aligned container, left-aligned text
- **Animation:** Staggered list items (0.08s), then body paragraphs
- **Credibility bar:** Separate `<div>`, 48px vertical padding, top border, centred text (14px muted, max 680px)

---

## 8. Structural Diagrams

### Alignment Framework Diagram (Strategy → Architecture → Execution)

```
┌─────────────────────────────────┐
│          Strategy               │  (border, centred serif text)
└─────────────────────────────────┘
              │                      (1px vertical line, 32px, teal 40%)
┌─────────────────────────────────┐
│ Executive Alignment Architecture│  (border + accent bg 30%)
│                                 │
│ ┌─────┐ ┌─────┐ ┌─────┐       │  (2×3 or 3×2 grid)
│ │Dim 1│ │Dim 2│ │Dim 3│       │
│ ├─────┤ ├─────┤ ├─────┤       │
│ │Dim 4│ │Dim 5│ │Dim 6│       │
│ └─────┘ └─────┘ └─────┘       │
└─────────────────────────────────┘
              │
┌─────────────────────────────────┐
│          Execution              │
└─────────────────────────────────┘
```

- Six dimensions: Strategic Interpretation, Decision Rights Clarity, Cross-Functional Coordination, Escalation Pathways, Accountability Architecture, Risk Ownership
- Middle layer: accent background at 30% opacity, primary border at 30%
- Dimension boxes: white background, border, 12px padding, 12px text
- Grid: 3 cols on md+, 2 cols on mobile

### Engagement Model Diagram (Measure → Install → Sustain)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Phase 1  │ ──→ │ Phase 2  │ ──→ │ Phase 3  │
│ Measure  │     │ Install  │     │ Sustain  │
│ EAI™     │     │ ALIGN™   │     │ Oversight│
└──────────┘     └──────────┘     └──────────┘
  ════════════════════════════════════════════
  Continuous engagement model (10px text)
```

- Three cards in a row (md+), stacked with vertical arrows on mobile
- Card: border, 24px padding, contains phase label (kicker), title (serif 18px), instrument name (12px primary), description (12px muted)
- Connectors: 24px horizontal line + arrow (border-based CSS triangle), teal at 30% opacity
- Underlying line: 1px, teal at 15%, with centred caption below

---

## 9. EAI Dashboard Preview Component

A board-ready mock report rendered as a card. Full specification:

### Outer Container
- Border: 1px solid border colour
- Background: card (white)
- Shadow: sm
- Border radius: default (6px)
- Inner padding: 32px / 48px (sm+)

### Header Row
- Left: kicker "EXECUTIVE ALIGNMENT INDEX™" (10px, tracking 2.5px, uppercase) + serif title "Alignment Index Report" (18px semibold)
- Right: Organisation name + date (11px muted), hidden on mobile
- Bottom border, 24px padding below

### Composite Score Block
- Centred, 32px vertical padding
- Score: serif, 36–48px bold
- Variance badge: pill shape, teal background tint, 10px uppercase label with dot indicator
- Italic commentary below (12–13px)

### Dimension Breakdown (Left Column)
- 6 rows, each with: dimension name (12px semibold), score (14px bold), horizontal bar (4px height, muted bg, teal fill), variance label pill
- Variance styles:
  - Low: `bg: hsl(180,25%,94%)`, `text: hsl(180,30%,60%)`
  - Moderate: `bg: hsl(180,40%,90%)`, `text: hsl(180,60%,26%)`
  - Elevated: `bg: hsl(180,35%,85%)`, `text: hsl(180,70%,18%)`

### Dispersion Mapping (Right Column)
- 4 dimension rows, each with range bar (box-style) and median marker (dot + 2px line)
- Scale: 1.0–5.0 at bottom

### Alignment Variance Grid
- 3-column (sm+), 1-column (mobile)
- Low / Moderate / High with descriptions
- Active state (Moderate): teal tinted background

### Confidence Level
- Radio-button style indicators (Low/Medium/High)
- Active indicator: filled circle in primary colour

### Priority Action Matrix
- 2×2 grid: Critical/Strategic/Operational/Monitor quadrants
- Each with action items (11px text)

### Governance Commentary
- Bullet list with open circle markers (1.5px border, primary colour)
- 12px text, relaxed line height

### Footer
- Top border, flex row: brand name left, "Confidential Advisory Document" right, 10px text

---

## 10. Buttons

### Primary CTA (`.btn-brief`)
- Display: inline-flex, centred
- Padding: 24px horizontal, 12px vertical
- Border: 1px solid foreground at 20% opacity
- Background: white
- Text: foreground, 14px, weight 500, tracking 0.03em
- Border radius: 2px
- Hover: border and text transition to primary (teal), 200ms
- No fill/solid buttons used anywhere on the public site

### Quiet Link (`.link-quiet`)
- Inline-flex with gap
- 14px, weight 500, foreground at 70%
- Hover: primary colour
- Tracking: wide

---

## 11. Animation Patterns

### Standard Fade
```
initial: { opacity: 0, y: 16px }
animate: { opacity: 1, y: 0 }
duration: 0.7s, ease: easeOut
trigger: whileInView, once: true
```

### Staggered Children
- Container: `staggerChildren: 0.12s`
- Each child: `opacity: 0, y: 12px → opacity: 1, y: 0`, duration 0.5s

### Hero-specific
- Teal accent rule: `scaleY: 0 → 1`, 0.8s
- Background image: `opacity: 0 → 1`, 1.2s, 0.4s delay
- Content blocks: CSS `fadeUp` animation with incremental delays (0s, 0.15s, 0.3s)

### Page Transitions
- AnimatePresence with `mode="wait"`
- Each page wrapped in a transition component

---

## 12. Footer

### Layout
- Top border (1px)
- Padding: 64px vertical
- 5-column layout (responsive, stacks on mobile):
  1. **Logo** (stacked variant)
  2. **Primary links** (4 items, no heading)
  3. **Programmes** (heading "Programmes", 3 links + workbook download button)
  4. **Course Downloads** (heading "Course Downloads", 9 links)
  5. **Executive Exercises** (heading "Executive Exercises", 7 links)

### Column Headings
- 12px, medium weight, 60% muted foreground, uppercase, tracking wider, 4px bottom margin

### Link Style
- 14px, muted foreground, tracking wide
- Hover: foreground colour

### Bottom Bar
- Top border, 48px above
- Content brief download link (12px, underlined)
- Copyright line: "Bright Leadership Consulting — Confidential Executive Advisory"
- Year: 60% opacity

---

## 13. Page Architecture

### Site Map

| Route | Page | Auth |
|-------|------|------|
| `/` | Homepage (5-section editorial) | No |
| `/executive-alignment-index` | EAI landing page (board memorandum style) | No |
| `/selected-engagements` | Case studies / engagement examples | No |
| `/executive-alignment-brief` | Downloadable brief page | No |
| `/contact` | Contact / enquiry form | No |
| `/executive-leadership-mastery` | 33-module programme detail | No |
| `/courses` | Executive programmes prospectus | No |
| `/augmented-leadership` | Methodology deep-dive | No |
| `/admin/login` | Admin login | No |
| `/admin/register` | Admin registration | No |
| `/admin` | Submission management | Admin |

### Navigation Hierarchy
- **Primary (Header):** EAI, Selected Engagements, Enquire (3 items only)
- **Secondary (Footer):** Executive Leadership Mastery, All Courses, Augmented Leadership™
- **Admin:** Not in any public navigation

---

## 14. Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Default (mobile) | <768px | Single column, stacked layouts, hamburger menu |
| `md` | ≥768px | Two-column grids, desktop nav visible |
| `lg` | ≥1024px | Full layouts, background images visible, sticky columns |

### Mobile-specific
- Instrument section: single column (no sticky)
- Advisory pathway: stacked cards with vertical arrow connectors
- EAI dashboard: single-column grids, variance row stacks vertically
- Header: hamburger menu with slide-down overlay

---

## 15. Shadows & Effects

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Header on scroll, dashboard card |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | Reserved |
| Backdrop blur | `blur(12px)` | Header on scroll only |

---

## 16. Scan List Pattern

Used throughout for declarative short-line lists:
- Left border: 2px solid border colour
- Left padding: 24px
- Item spacing: 8px
- Text: 18px, muted foreground, relaxed line height

---

## 17. Proprietary Instruments & Trademarks

Always render with ™ symbol:
- **Executive Alignment Index™** — diagnostic assessment
- **ALIGN™ Executive Intervention** — structural installation
- **Executive Oversight™** — ongoing governance
- **Augmented Leadership™** — AI-leadership methodology
- **AI Leadership Blueprint™** — strategic planning template

---

## 18. Content Tone & Terminology

| Use | Never Use |
|-----|-----------|
| Advisory | Coaching |
| Executive Development | Training |
| Programme | Course (in formal contexts) |
| Enquire | Enrol / Sign Up |
| Engagement | Package / Deal |
| Confidential conversation | Sales call / Demo |

---

## 19. Backend Requirements

| Feature | Implementation |
|---------|---------------|
| Contact form submissions | Database table with RLS |
| Newsletter subscriptions | Database table with RLS |
| Lead magnet email capture | Database table with RLS |
| Rate limiting | Server-side function + database |
| Admin authentication | Email/password with email verification |
| Role-based access | `user_roles` table with `has_role()` function |
| AI chat assistant | Server function with streaming SSE |

See `content-brief-new-project.md` for full programme content, course structures, and data schemas.

---

*End of specification.*
