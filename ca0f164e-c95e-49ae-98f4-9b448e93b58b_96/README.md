# Ndi Umuhuza — Rwanda Nutrition Connect

Lightweight Next.js app for nutrition analytics, GIS mapping, and ML predictions.

## Quick start (local)

1. Install
   ```powershell
   npm install
   ```

2. Create a local env file (do NOT commit secrets). Example (.env.local recommended):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run dev server
   ```powershell
   npm run dev
   # Open http://localhost:3000
   ```

## Build & static export (for Netlify)

This project uses Next.js static export (see next.config.ts with `output: "export"`).

- Build + export locally:
  ```powershell
  npm run build:export
  ```
  That produces the `out/` directory for static hosting.

- Netlify
  - Ensure `netlify.toml` build command = `npm run build:export` and publish = `out`
  - Add environment variables in Netlify site settings:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Connect GitHub repo to Netlify (auto-deploy on push) or run:
    ```powershell
    netlify deploy --prod --dir=out
    ```

## Supabase serverless functions

Server functions live under `supabase/functions/*` — deploy with Supabase CLI.

## Troubleshooting

- "supabaseUrl is required" during export → set Netlify build env vars or guard client creation in code.
- If `out/` isn’t generated run `npm run build:export` locally and inspect errors.

## Deployment checklist

1. Add Netlify env vars (public anon key + url).
2. Confirm `netlify.toml` build command = `npm run build:export`.
3. Push to GitHub — Netlify will auto-deploy.
4. Deploy Supabase functions separately with `supabase` CLI.

License: MIT
