# Bright Leadership Consulting — Developer Handoff
## Institutional Gravity Design System v2.0

> Comprehensive specification for reconstructing the design system in a new project environment.

---

## 1. Design Philosophy

**Institutional Gravity** is a two-tier visual system that balances board-pack clarity with strategy-firm polish. It avoids decorative graphics, stock imagery, and marketing-heavy aesthetics in favour of typographic precision, structured whitespace, and institutional composure.

**Reference models:** Strategy&, The Economist, Stripe, IDEO, Bridgewater Associates.

---

## 2. Colour Palette (HSL)

### Core Ratio: 60 / 25 / 10 / 5

| Role | Token | HSL | Hex | Usage % |
|------|-------|-----|-----|---------|
| White (background) | `--background` | `0 0% 100%` | `#FFFFFF` | 60% |
| Pearl (alt sections) | `--pearl` | `220 20% 97%` | `#F5F6F8` | Part of 60% |
| Deep Navy (footer, high-impact) | `--navy` | `216 70% 14%` | `#0B1D3B` | 25% |
| Navy text | `--navy-foreground` | `220 20% 92%` | Light grey on navy | — |
| Charcoal (body text) | `--foreground` | `0 0% 12%` | `#1F1F1F` | — |
| Muted text | `--muted-foreground` | `0 0% 40%` | `#666666` | — |
| Muted Teal (analytical) | `--primary` | `186 52% 25%` | `#1F5C63` | 10% |
| Soft Gold (kickers, CTAs) | `--gold` | `42 50% 52%` | `#C2A24D` | 5% |
| Gold muted | `--gold-muted` | `42 40% 65%` | — | — |
| Divider grey | `--border` | `0 0% 90%` | `#E6E6E6` | — |

### Extended Teal Scale
| Token | HSL |
|-------|-----|
| `--teal-50` | `186 30% 97%` |
| `--teal-100` | `186 25% 92%` |
| `--teal-500` | `186 45% 35%` |
| `--teal-600` | `186 52% 25%` |
| `--teal-700` | `186 55% 20%` |
| `--teal-900` | `186 60% 12%` |

### Amber/Gold Scale
| Token | HSL |
|-------|-----|
| `--amber-400` | `38 95% 60%` |
| `--amber-500` | `38 92% 55%` |
| `--amber-600` | `32 90% 48%` |

---

## 3. Typography

### Fonts
- **Headings:** Libre Baskerville (400, 700, 400i) — `font-serif`
- **Body:** Inter (300–700) — `font-sans`
- **Google Fonts import:** `Libre+Baskerville:ital,wght@0,400;0,700;1,400&Inter:wght@300;400;500;600;700`

### Scale

| Class | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `.heading-hero` | 42px / 48px (lg) | 1.15 | 600 | 0.02em |
| `.heading-section` | 28px / 32px (lg) | 1.25 | 600 | 0.02em |
| `.heading-sub` | 20px / 22px (lg) | 1.4 | 500 | 0.02em |
| `.body-brief` | 18px | 1.65 | 400 | normal |
| `.kicker` | 12px (xs) | default | 500 | 0.2em, uppercase |
| `.emphasis-line` | 24px / 28px (lg) | snug | 600 (serif) | 0.02em |

### Paragraph Rules
- `.body-brief p` — bottom margin: 1.2em; last-child: 0
- Max reading width: `.prose-narrow` = 680px

---

## 4. Layout Architecture

### Container
- `.container-brief` — max-width: 1140px, px: 32/64/80px (responsive)
- `.prose-narrow` — max-width: 680px

### Section Spacing
- `.section-brief` — 100px vertical padding
- Hero sections: `pt-36 pb-24 lg:pt-44 lg:pb-32`

### Section Alternation Pattern
Sections alternate between White (`bg-background`) and Pearl (`section-pearl`):

```
Hero (White) → Section A (Pearl) → Section B (White) → Section C (Pearl) → ...
```

Each page follows this rhythm. The hero is always white.

### Dividers
- `.section-divider` — 1px, max-width 680px, centered, `hsl(var(--border))`
- `.section-divider-full` — 1px, full width

---

## 5. Component Patterns

### Kicker (Section Eyebrow)
```css
.kicker {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: hsl(var(--gold)); /* Soft Gold #C2A24D */
}
```

### Button — Primary CTA
```css
.btn-brief {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid rgba(foreground, 0.2);
  background: white;
  color: charcoal;
  font-weight: 500;
  letter-spacing: 0.03em;
  transition: colors 200ms;
}
.btn-brief:hover {
  border-color: hsl(38, 60%, 52%); /* Gold */
  color: hsl(38, 60%, 52%);
}
```

### Quiet Link CTA
```css
.link-quiet {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(foreground, 0.7);
  letter-spacing: wider;
  transition: color 300ms;
}
.link-quiet:hover {
  color: hsl(var(--primary)); /* Muted Teal */
}
```

### Scan List (Declarative Short Lines)
```css
.scan-list {
  border-left: 2px solid hsl(var(--border));
  padding-left: 24px;
  space-y: 8px;
}
.scan-list p {
  font-size: 18px;
  color: hsl(var(--muted-foreground));
  line-height: relaxed;
}
```

### Emphasis Line (Serif Pull-Quote)
```css
.emphasis-line {
  font-family: 'Libre Baskerville';
  font-weight: 600;
  font-size: 24px / 28px (lg);
  line-height: snug;
  color: charcoal;
  padding: 12px 0;
}
```

---

## 6. Header

- Sticky, reduces from 80px → 64px on scroll
- Background blur on scroll: `bg-background/95 backdrop-blur-md`
- Three nav items: Executive Alignment Index™, Selected Engagements, Enquire Confidentially
- Nav link style: 14px, `tracking-[0.03em]`, weight 400 (500 when active)
- CTA button: `.btn-brief` with gold hover accent
- Gap between items: `gap-11` (44px)
- Mobile: hamburger → slide-down panel with AnimatePresence

---

## 7. Footer

- Background: Deep Navy `hsl(var(--navy))` — `#0B1D3B`
- Text: `hsl(var(--navy-foreground))` — light grey
- Column headers: Soft Gold (`hsl(var(--gold))`)
- Five columns: Brand, Navigation, Programmes, Course Downloads, Executive Exercises
- Developer Resources row: download links for Content Brief, Layout Spec, Design Philosophy, Mockups
- Bottom CTA: Gold-outlined button — `border: 1px solid hsl(38, 60%, 52%)`, hover fills gold

---

## 8. Animation

- **Library:** Framer Motion
- **Standard fade pattern:**
  ```js
  const fade = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" },
  };
  ```
- Stagger children: `staggerChildren: 0.12`
- Diagrams: `scale: 0.95 → 1`, duration 0.8
- No decorative animations, no bouncing, no parallax

---

## 9. Page Structure

### Every page follows:
1. `<SEOHead>` — title <60 chars, description <160 chars
2. `<ScrollProgress>` — thin progress bar at top
3. `<Header>` — sticky nav
4. `<main>` — sections with pearl alternation
5. `<Footer>` — navy institutional footer

### Section pattern within pages:
```
Hero (white, kicker + heading-hero + body-brief)
  ↓ section-divider
Section A (section-pearl, kicker + heading-section + content)
  ↓ section-divider
Section B (bg-background, kicker + heading-section + content)
  ↓ section-divider
Section C (section-pearl, kicker + heading-section + content)
  ↓
Footer (navy)
```

---

## 10. Key Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — value proposition, structural problem, EAI intro |
| `/executive-alignment-index` | Diagnostic instrument page |
| `/executive-alignment-brief` | Downloadable HTML brief |
| `/selected-engagements` | Anonymised case abstracts |
| `/executive-leadership-mastery` | 33-module CPD programme |
| `/courses` | Programme portfolio overview |
| `/augmented-leadership` | Proprietary AI methodology |
| `/contact` | Confidential enquiry form |

---

## 11. Conversion Language

- **Never use:** "Book a call", "Get started", "Sign up", "Free trial"
- **Always use:** "Enquire Confidentially", "Initiate a Confidential Conversation", "Arrange a Conversation"
- Confirmation copy: "Your enquiry has been received. A member of our team will respond shortly."

---

## 12. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| Animation | Framer Motion |
| Components | shadcn/ui (Radix primitives) |
| Forms | React Hook Form + Zod |
| Backend | Supabase (auth, database, edge functions) |
| Routing | React Router v6 |

---

*Document generated for project handoff. All design tokens, ratios, and patterns are derived from the live codebase.*
