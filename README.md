# Forge AI

Forge AI turns a website and a product brief into a persistent, editable product strategy and build concept using the Gemini API.

## Local setup

1. Copy `.env.example` to `.env.local` and supply the four values below.
2. In the Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql).
3. In Supabase Authentication, enable Email/Password sign-in and configure the local redirect URL.
4. Run `npm run dev`, then open http://localhost:3000.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional; defaults to `gemini-2.5-flash`)

## Verification

`npm run lint` checks the source and `npm run build` creates the production build. A real end-to-end AI run requires an authenticated Supabase account, an applied database migration, and a valid Gemini API key.

## Deployment

This is a standard Next.js application ready for Vercel. Import the repository in Vercel, add the same environment variables in Project Settings, and deploy. In Supabase Authentication, add the deployed URL to Site URL and Redirect URLs. The SQL migration must be applied once before users create projects.
