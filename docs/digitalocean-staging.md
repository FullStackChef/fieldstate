# DigitalOcean Staging

This project now uses the same App Platform shape as RippleApp:

- `services`: API backend
- `static_sites`: frontend SPA
- `ingress`: `/api` routes to API and `/` routes to frontend

The deploy spec lives at `.do/app.yaml`.

## What this gives you

- Frontend and API deploy together from one app spec
- Public routing handled by DigitalOcean ingress
- No separate frontend proxy setup required
- Riley can call `/api/riley` directly in staging

## Deploy with doctl

1. Create the app once:

```bash
doctl apps create --spec .do/app.yaml
```

2. After creation, DO will auto-deploy on pushes to `main` because `deploy_on_push: true` is enabled for both components.

3. In App Platform settings, set runtime secret:

- `OPENAI_API_KEY` on the `api` component

## Spec details (matches RippleApp pattern)

- API component:
	- Build: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
	- Run: `node artifacts/api-server/dist/index.cjs`
	- Port: `3001`
	- Health check: `/api/healthz`

- Frontend component:
	- Build: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/fieldstate run build`
	- Output: `artifacts/fieldstate/dist/public`
	- Catch-all: `index.html`

- Ingress routing:
	- `/api` -> `api`
	- `/` -> `frontend`

## Notes

- `VITE_API_BASE_URL` is not required for DO staging with ingress routing.
- API also runs locally without setting `PORT` (defaults to `3001`).