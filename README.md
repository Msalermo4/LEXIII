# LEXIII • Plug‑and‑Play Launch Kit (PR *In re* tracker)

Spanish-first, production-ready. One deploy to Vercel + Supabase. Includes:
- Public search + profile pages with Fuente/PDF
- Admin upload (CSV) + task to refresh from Poder Judicial
- PR harvester (2010–present) that inserts directly into Postgres
- Status normalization for Spanish disciplinary terms (Suspensión, Censura, etc.)

## 1) Create Supabase (Free)
- New project → copy **Project URL**, **anon key**, and **connection string**.
- In Supabase **SQL** run: `prisma/migrations/0001_init.sql` (creates tables & indexes).

## 2) Deploy to Vercel (Free)
- Import this folder as a new project (Git or "Import manually").
- Add Environment Variables:
  - `DATABASE_URL`  → your Supabase connection string + `?pgbouncer=true&connection_limit=1`
  - `DIRECT_URL`    → same string **without** pgbouncer (for migrations/harvester)
  - `SUPABASE_URL`  → project URL
  - `SUPABASE_ANON_KEY` → anon key
  - `ADMIN_PASSWORD` → password for /admin (e.g., Lexi4!)
  - `TASK_TOKEN` → any random string to protect /api/tasks/refresh
- Deploy.

## 3) Load ALL *In re* (2017→present or earlier)
Option A — **One-click from your computer** (recommended):
```bash
# Locally (Node 18+, pnpm or npm)
pnpm i
cp .env.example .env.local  # paste your keys
pnpm prisma generate
pnpm prisma migrate deploy
pnpm harvest:pr -- 2017 2025      # scrape & insert directly into your Supabase
pnpm dev  # preview locally, or skip if already on Vercel
```

Option B — **From Vercel (serverless task)**:
- Hit: `https://<your-app>.vercel.app/api/tasks/refresh?token=YOUR_TASK_TOKEN&start=2017&end=2025`
  (The endpoint will run the harvester in the cloud and insert to Supabase.)

Option C — **CSV upload**:
- If you already have CSV, go to **/admin** → Upload CSV to import.

### CSV Columns
`full_name,bar_number,status,status_effective_date,action_type,decision_date,citation,summary,source_url,pdf_url`

---
This kit is designed to be **accurate, complete, and auditable**:
- Every action shows official **Fuente** (decision page) and **PDF** link.
- Normalization maps Spanish terms to canonical statuses you can filter on.
- Timeline keeps multiple actions per attorney (suspensiones, reinstalaciones, censuras, etc.).
