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
