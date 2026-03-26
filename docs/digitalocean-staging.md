# DigitalOcean Staging

This project uses App Platform with explicit startup commands for both components:

- one `service` for API
- one `service` for frontend (`fieldstate`)
- ingress rules for `/api` and `/`

The source of truth is [.do/app.yaml](.do/app.yaml).

## Why your current deploy failed

The error `determine start command: when there is no default process a command is required` means a DO component is currently treated as a service without a valid run command.

In this repo, `fieldstate` is now a runnable service with an explicit `run_command`, so DO no longer needs to infer a default process.

## Current expected component layout

From [.do/app.yaml](.do/app.yaml):

- `api` (service)
  - build: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
  - run: `node artifacts/api-server/dist/index.cjs`
  - health: `/api/healthz`

- `fieldstate` (service)
  - build: `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/fieldstate run build`
  - run: `pnpm --filter @workspace/fieldstate run serve -- --host 0.0.0.0 --port 4173`

- ingress
  - `/api` -> `api`
  - `/` -> `fieldstate`

## Fix in DigitalOcean

If this app already exists in DO and has an old `fieldstate` service component, replace its config with the spec:

```bash
doctl apps list
doctl apps update <APP_ID> --spec .do/app.yaml
```

If update still preserves old/bad components, recreate once from spec:

```bash
doctl apps create --spec .do/app.yaml
```

Then set runtime secret on the `api` component:

- `OPENAI_API_KEY`

## Notes

- `VITE_API_BASE_URL` is not required in this ingress setup.
- API defaults to `PORT=3001`.