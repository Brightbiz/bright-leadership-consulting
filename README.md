# Bright Leadership Consulting — Developer Setup

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **UI Library:** shadcn/ui (Radix primitives)
- **Animation:** Framer Motion
- **Backend:** Lovable Cloud (Supabase-powered)
- **Routing:** React Router v6

---

## Getting Started

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd <PROJECT_FOLDER>

# 2. Install dependencies
npm install

# 3. Create a .env file (copy from .env.example or use the values below)
#    VITE_SUPABASE_URL=<provided separately>
#    VITE_SUPABASE_PUBLISHABLE_KEY=<provided separately>

# 4. Start the dev server
npm run dev
```

The app runs at `http://localhost:8080`.

---

## Project Structure

```
src/
├── assets/          # Images, videos, static assets
├── components/      # Reusable UI components
│   ├── ui/          # shadcn/ui primitives
│   ├── heroes/      # Page hero sections
│   ├── chat/        # AI chat widget components
│   └── skeletons/   # Loading skeleton components
├── hooks/           # Custom React hooks
├── integrations/    # Supabase client & generated types (DO NOT EDIT)
├── lib/             # Utility functions
├── pages/           # Route-level page components
├── test/            # Test files
└── utils/           # Helper utilities

public/
├── brochures/       # Downloadable brochure HTML files
└── downloads/       # Developer handoff docs, PDFs, exports

supabase/
└── functions/       # Edge functions (auto-deployed)
    ├── chat-assistant/
    └── check-rate-limit/
```

---

## Key Files (Do Not Edit)

These files are auto-generated and managed by the platform:

- `src/integrations/supabase/client.ts` — Supabase client
- `src/integrations/supabase/types.ts` — Database types
- `.env` — Environment variables
- `supabase/config.toml` — Supabase configuration

---

## Database & Backend

Full backend documentation (tables, RLS policies, edge functions, secrets) is in:

📄 **[`public/downloads/developer-handoff.md`](public/downloads/developer-handoff.md)**

### Quick Reference — Tables

| Table | Purpose |
|-------|---------|
| `contact_submissions` | Contact form entries |
| `newsletter_subscribers` | Email subscribers |
| `lead_magnet_downloads` | Lead magnet email captures |
| `checklist_results` | Leadership assessment results |
| `rate_limits` | Server-side rate limiting |
| `user_roles` | Admin/user role assignments |

---

## Authentication

- Email/password with mandatory email verification
- Admin routes: `/admin/login`, `/admin/register`, `/admin/submissions`
- Admin access controlled via `user_roles` table

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests via Vitest |

---

## Edge Functions

Edge functions in `supabase/functions/` are deployed automatically. They require these secrets (already configured in production):

- `LOVABLE_API_KEY` — AI gateway for chat assistant
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Auto-provided

---

## Deployment

The app is deployed via Lovable. To publish: open the Lovable editor → Share → Publish.

For self-hosting, run `npm run build` and serve the `dist/` folder with any static host.
