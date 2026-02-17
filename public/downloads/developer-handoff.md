# Developer Handoff — Bright Leadership Consulting

> Generated: 2026-02-14

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **UI Library**: shadcn/ui (Radix primitives)
- **Animation**: Framer Motion
- **Backend**: Supabase (Lovable Cloud)
- **Routing**: React Router v6

---

## Supabase Project

| Key | Value |
|-----|-------|
| **Project ID** | `kjpvtgprikfnjkczbuyp` |
| **API URL** | `https://kjpvtgprikfnjkczbuyp.supabase.co` |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcHZ0Z3ByaWtmbmprY3pidXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2ODIzNzYsImV4cCI6MjA4NTI1ODM3Nn0.j-lIdPLClzRHPPpkagEWodsWbIOQ87yH98Pg9M_hEy4` |

> ⚠️ **Never share the Service Role Key** — it bypasses all RLS.

---

## Database Tables

### 1. `contact_submissions`

Stores contact form entries.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| name | text | No | — |
| email | text | No | — |
| phone | text | Yes | — |
| company | text | Yes | — |
| message | text | No | — |
| is_read | boolean | No | `false` |
| created_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Anyone can submit contact form` — INSERT with check `true`
- `Admins can view submissions` — SELECT where `has_role(auth.uid(), 'admin')`
- `Admins can update submissions` — UPDATE where `has_role(auth.uid(), 'admin')`
- `Admins can delete submissions` — DELETE where `has_role(auth.uid(), 'admin')`

---

### 2. `newsletter_subscribers`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| email | text | No | — |
| source | text | No | `'blog'` |
| subscribed_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Anyone can subscribe to newsletter` — INSERT with check `true`
- `Admins can view subscribers` — SELECT where `has_role(auth.uid(), 'admin')`
- `Admins can delete subscribers` — DELETE where `has_role(auth.uid(), 'admin')`
- No UPDATE allowed

---

### 3. `lead_magnet_downloads`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| name | text | Yes | — |
| email | text | No | — |
| lead_magnet_name | text | No | `'5-leadership-secrets'` |
| downloaded_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Anyone can submit their email for lead magnet` — INSERT with check `true`
- `Admins can view all lead magnet downloads` — SELECT (admin only)
- No UPDATE or DELETE allowed

---

### 4. `checklist_results`

Stores leadership checklist assessment results (authenticated users only).

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| user_id | uuid | No | — |
| checked_items | text[] | No | `'{}'` |
| score | integer | No | `0` |
| created_at | timestamptz | No | `now()` |
| updated_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Users can insert their own results` — INSERT where `auth.uid() = user_id`
- `Users can view their own results` — SELECT where `auth.uid() = user_id`
- `Users can update their own results` — UPDATE where `auth.uid() = user_id`
- No DELETE allowed

---

### 5. `rate_limits`

Server-side rate limiting tracker.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| ip_address | text | No | — |
| form_type | text | No | — |
| created_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Service role can manage rate limits` — ALL where `true` (service role only)

---

### 6. `user_roles`

RBAC role assignments.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | `gen_random_uuid()` |
| user_id | uuid | No | — |
| role | app_role (`admin` \| `user`) | No | — |
| created_at | timestamptz | No | `now()` |

**RLS Policies:**
- `Admins can manage roles` — ALL where `has_role(auth.uid(), 'admin')`
- `Admins can view all roles` — SELECT where `has_role(auth.uid(), 'admin')`

---

## Database Functions

### `has_role(_user_id uuid, _role app_role) → boolean`
Checks if a user has a specific role. Used in RLS policies.

### `cleanup_old_rate_limits() → void`
Deletes rate limit entries older than 1 hour. Called by the rate-limit edge function.

### `update_updated_at_column() → trigger`
Auto-updates `updated_at` on row modification.

---

## Enums

- **`app_role`**: `'admin'` | `'user'`

---

## Edge Functions

### 1. `check-rate-limit`

**Purpose:** Server-side rate limiting for forms.

**Endpoint:** `POST /functions/v1/check-rate-limit`

**Request body:**
```json
{ "formType": "contact" | "newsletter" | "lead_magnet", "action": "check" | "record" }
```

**Rate limits:**
- `contact`: 3 per hour
- `newsletter`: 5 per hour
- `lead_magnet`: 5 per hour

**Returns:** `{ allowed: boolean, remaining: number, retryAfterMinutes?: number }`

---

### 2. `chat-assistant`

**Purpose:** AI-powered leadership assistant chatbot (streaming).

**Endpoint:** `POST /functions/v1/chat-assistant`

**Request body:**
```json
{ "messages": [{ "role": "user", "content": "..." }] }
```

**Returns:** SSE stream (`text/event-stream`)

**Required secret:** `LOVABLE_API_KEY`

---

## Authentication

- Email/password auth with **mandatory email verification** (auto-confirm disabled)
- Anonymous signups **disabled**
- Admin routes: `/admin/login`, `/admin/register`, `/admin/submissions`
- Admin access determined by `user_roles` table

---

## Key Frontend Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Homepage | No |
| `/about` | About Us | No |
| `/services` | Services | No |
| `/courses` | Courses | No |
| `/blog` | Blog | No |
| `/contact` | Contact | No |
| `/masterclass` | Masterclass landing | No |
| `/leadership-checklist` | Assessment tool | No |
| `/brochures` | Brochure downloads | No |
| `/admin/login` | Admin login | No |
| `/admin/register` | Admin registration | No |
| `/admin/submissions` | View submissions | Admin |

---

## Secrets (Edge Function Environment)

| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Auto-provided |
| `SUPABASE_ANON_KEY` | Auto-provided |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provided |
| `LOVABLE_API_KEY` | AI gateway for chat assistant |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

The Supabase client is pre-configured at `src/integrations/supabase/client.ts` — import from there, never create a new client.

---

## WordPress Migration Guide

### Option 1: Iframe Embedding (Recommended)

Embed the published Lovable app (or specific routes) directly into WordPress pages using an iframe. This preserves all interactive features — assessments, quizzes, chat widget, and lead capture — without re-building them.

```html
<!-- Full site embed -->
<iframe
  src="https://your-published-url.lovable.app"
  width="100%"
  height="800"
  style="border: none; max-width: 100%;"
  loading="lazy"
  title="Bright Leadership Consulting"
></iframe>

<!-- Embed a specific tool (e.g., Pre-Course Assessment) -->
<iframe
  src="https://your-published-url.lovable.app/pre-assessment"
  width="100%"
  height="900"
  style="border: none; max-width: 100%;"
  loading="lazy"
  title="Leadership Pre-Course Assessment"
></iframe>
```

**Recommended pages to embed individually:**

| WordPress Page | Iframe Route |
|---------------|--------------|
| Pre-Course Assessment | `/pre-assessment` |
| Post-Course Assessment | `/post-assessment` |
| Leadership Readiness Quiz | `/masterclass` (contains quiz modal) |
| Leadership Checklist | `/leadership-checklist` |
| Contact Form | `/contact` |

**WordPress plugin tip:** Use a plugin like *Advanced iFrame* or *Insert Headers and Footers* for responsive iframe sizing and auto-height adjustment.

### Option 2: Custom Domain Pointing

Point your domain (or a subdomain like `app.yourdomain.com`) directly to the Lovable app:

**DNS Records Required:**

| Type | Name | Value |
|------|------|-------|
| A | `@` (root) | `185.158.133.1` |
| A | `www` | `185.158.133.1` |
| TXT | `_lovable` | `lovable_verify=<your-verification-code>` |

> SSL is provisioned automatically once DNS propagates (up to 72 hours).

If your WordPress site lives at `yourdomain.com`, you can point a subdomain like `tools.yourdomain.com` to the Lovable app and link to it from WordPress navigation.

### Option 3: Static Build Self-Hosting

The GitHub repository contains the full source. To build and host independently:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <PROJECT_FOLDER>
npm install
npm run build
# Deploy the dist/ folder to any static host (Netlify, Vercel, etc.)
```

> **Note:** The app depends on the Lovable Cloud backend for database, auth, and edge functions. These will continue to work regardless of where the frontend is hosted, as long as the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are set.

---

## Key Interactive Tools (Preserve During Migration)

These features rely on the backend and should NOT be rebuilt in WordPress — use iframe embedding instead:

| Feature | Route | Backend Dependency |
|---------|-------|--------------------|
| Pre-Course Assessment | `/pre-assessment` | `assessment_results` table (auth required) |
| Post-Course Assessment | `/post-assessment` | `assessment_results` table (auth required) |
| Leadership Readiness Quiz | `/masterclass` | `readiness_quiz_results` table |
| Contact Form | `/contact` | `contact_submissions` + rate limiting |
| AI Chat Assistant | Floating widget | `chat-assistant` edge function |
| Lead Magnet Download | Homepage section | `lead_magnet_downloads` table |
| Newsletter Signup | Footer / Blog | `newsletter_subscribers` table |
| Leadership Checklist | `/leadership-checklist` | `checklist_results` table (auth required) |

---

## Thinkific Enrollment Link Mapping

All enrollment buttons and CTA links point to the Thinkific platform. These are the canonical URLs:

| Program / Course | Thinkific URL |
|-----------------|---------------|
| **Executive Leadership Mastery (Self-Paced)** | `https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program` |
| **Advanced Leadership Skills** | `https://bright-leadership-consulting.thinkific.com/courses/executive-leadership-mastery-program` |
| Transformational Leadership | `https://bright-leadership-consulting.thinkific.com/courses/transformational-leadership` |
| Achieving Peak Performance | `https://bright-leadership-consulting.thinkific.com/courses/achieving-peak-performance` |
| Building Professional & Personal Value | `https://bright-leadership-consulting.thinkific.com/courses/building-professional-and-personal-value` |
| The Future of Work | `https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work` |
| Employability Skills for Employees | `https://bright-leadership-consulting.thinkific.com/courses/employability-skills-for-employees` |

**Where each link appears:**

| Link | Used In |
|------|---------|
| Self-Paced (`/new-executive-leadership-mastery-program`) | PricingTiers, ExecutiveProgramSection, Courses page, ReadinessQuizModal, readinessQuizQuestions data, Masterclass VSL, Executive brochure |
| Advanced Leadership (`/executive-leadership-mastery-program`) | Advanced Leadership brochure |
| Individual courses | Courses page course cards, respective brochures |

> **Important:** The Self-Paced tier and the Masterclass funnel both use the same `/new-executive-leadership-mastery-program` URL. Do not confuse with `/executive-leadership-mastery-program` (Advanced Leadership Skills) or the legacy `/copy-of-executive-leadership-mastery-program` (deprecated).
