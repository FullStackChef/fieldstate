# DigitalOcean staging

This repo can be staged on DigitalOcean as a frontend-only App Platform static site.

## Recommended shape

- App type: `Static Site`
- Purpose: stage the UX only
- Backend requirement: none
- Riley behavior in staging: falls back locally if `/api/riley` is unavailable

## Build settings

Use the repo root as the app source so pnpm workspace resolution still works.

- Source directory: repo root
- Build command: `pnpm install --frozen-lockfile && pnpm --filter @workspace/fieldstate build`
- Output directory: `artifacts/fieldstate/dist/public`
- Index document: `index.html`
- Catch-all / rewrite: route all paths to `index.html`

## App environment variables

Set these as build-time env vars in DigitalOcean App Platform:

- `BASE_PATH=/`
- `PORT=4173`
- `VITE_API_BASE_URL=`

Notes:

- `BASE_PATH=/` keeps the SPA rooted at the domain root.
- `PORT` is not used by the static output itself, but the Vite config expects a valid numeric default for preview/server settings.
- Leave `VITE_API_BASE_URL` empty for frontend-only staging. Riley will fall back in-browser if the API is not present.

## Deploy flow

1. In DigitalOcean, create a new App Platform app from this GitHub repo.
2. Choose the branch you want to use for staging.
3. Configure it as a `Static Site` component.
4. Set the build and output values above.
5. Add the build-time env vars above.
6. Add SPA catch-all routing to `index.html`.
7. Deploy.

## What works in this staging setup

- Landing pages and navigation
- Visual UX review
- Riley UI shell and local fallback behavior
- Static content and route testing

## What does not work in this staging setup

- Live backend endpoints
- Persistent lead capture
- Any server-side integration that depends on `/api/*`

## If you want a slightly richer staging next

The next step is adding the API as a second App Platform component and setting:

- frontend `VITE_API_BASE_URL` to the API hostname
- frontend proxying off for production
- backend runtime env vars separately