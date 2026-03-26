# FieldState DigitalOcean Staging Deployment (Full Stack)

This guide covers deploying FieldState as a **full-stack application** on DigitalOcean App Platform with both frontend (React SPA) and backend API.

## Quick Start

### Prerequisites
- DigitalOcean account with App Platform enabled
- GitHub repository with this code (brettsmith/FieldState)
- Optional: OpenAI API key for Riley AI features

### Deployment Options

#### Option 1: Automatic via `.do/app.yaml` (**Recommended**)

1. Connect your GitHub repo `brettsmith/FieldState` to DigitalOcean App Platform
2. DO will auto-detect `.do/app.yaml` and deploy both components automatically
3. Both services will be live at public DO URLs

#### Option 2: Manual Docker Multi-Component Setup

1. Go to DigitalOcean App Platform
2. Create a new app and connect GitHub repo `brettsmith/FieldState` (main branch)
3. Add two components as described below

## Component Configuration

### Component 1: Frontend Service

**Settings:**
- **Name**: fieldstate-frontend
- **Source type**: GitHub repository
- **Dockerfile path**: `Dockerfile.frontend`
- **HTTP port**: 4173
- **Build command**: (auto-detected)
- **Run command**: (auto-detected)

**Environment Variables:** (none required)

**What it does:**
- Serves the React SPA (single-page app)
- Webpack bundled and optimized by Vite
- Public URLs auto-redirect 404s to index.html for SPA routing
- Lightweight Node HTTP server (~15MB container)

### Component 2: API Service

**Settings:**
- **Name**: fieldstate-api
- **Source type**: GitHub repository  
- **Dockerfile path**: `Dockerfile.api`
- **HTTP port**: 3001
- **Build command**: (auto-detected)
- **Run command**: (auto-detected)

**Environment Variables:**
- `OPENAI_API_KEY` = *(your OpenAI API key)* — **Required for Riley AI to work**
- `OPENAI_MODEL` = `gpt-4.1-mini` — *(optional, uses this default)*

**What it does:**
- Runs Express.js backend server
- Provides `/api/healthz` (health check endpoint)
- Provides `/api/riley` (AI chat endpoint - requires OPENAI_API_KEY)
- CORS enabled for frontend SPA requests

## Architecture Diagram

```
FieldState Staging on DO
├── Public Internet
│   ├── https://fieldstate-frontend-xxx.ondigitalocean.app  → Frontend Container
│   └── https://fieldstate-api-xxx.ondigitalocean.app      → API Container
│
├── Frontend Container (Node + Vite)
│   ├── Listens on :4173
│   ├── Serves index.html + React SPA
│   └── Requests to /api/* proxy to backend service
│
└── API Container (Node + Express)
    ├── Listens on :3001
    ├── GET /api/healthz → {"ok":true}
    └── POST /api/riley → AI endpoint (requires OPENAI_API_KEY)
```

## Deployment Workflow

### First-Time Setup

1. **In DigitalOcean console**:
   - Create new App Platform app
   - Connect GitHub: `brettsmith/FieldState` main branch
   - DO auto-detects Dockerfiles from `.do/app.yaml`
   - Add component 2 environment: `OPENAI_API_KEY` = your key
   - Click Deploy

2. **Monitor build logs**:
   - Frontend: `pnpm install → vite build` (~2-3 min)
   - API: `pnpm install → typescript compile → esbuild bundle` (~3-5 min)
   - Total: ~5-10 minutes first time

3. **Your app will be live at**:
   - Frontend: `https://fieldstate-frontend-xxx.ondigitalocean.app`
   - API: `https://fieldstate-api-xxx.ondigitalocean.app`

### Updates

1. **Make code changes locally**:
   ```bash
   # Fix bug, add feature, etc.
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **DO automatically**:
   - Detects push to main
   - Rebuilds both Dockerfiles
   - Deploys both services
   - Zero downtime (rolling updates)

## Testing the Deployment

### 1. Frontend is serving

```bash
curl https://fieldstate-frontend-xxx.ondigitalocean.app
# Should return HTML containing <title>FieldState</title>
```

### 2. API is healthy

```bash
curl https://fieldstate-api-xxx.ondigitalocean.app/api/healthz
# Should return: {"ok":true,"version":"0.0.0"}
```

### 3. Riley AI works (if OPENAI_API_KEY is set)

In browser console on the frontend, inspect Network tab and call:
```javascript
fetch('/api/riley', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userInput: "what is my system about?",
    systemContext: {...}
  })
}).then(r => r.json()).then(console.log)
```

Should return AI response if key is valid.

## Build Details

### Frontend Build (`Dockerfile.frontend`)

**Process**:
1. Multi-stage build reduces final image size
2. Stage 1 (builder): Installs deps, runs `pnpm --filter @workspace/fieldstate build`
3. Stage 2 (runtime): Copies built assets, installs `serve` npm package
4. Runtime runs: `serve -l 4173 /app/public`

**Output files**:
- `/public/index.html` (SPA entry point)
- `/public/assets/` (vendor + app bundles)
- `/public/images/` (public images)

**Container size**: ~30-40MB

### API Build (`Dockerfile.api`)

**Process**:
1. Multi-stage build (prod deps optimization)
2. Stage 1 (builder): Installs all deps, TypeScript compile, esbuild bundle
3. Stage 2 (runtime): Copies prod+only deps + compiled bundle
4. Runtime runs: `node ./artifacts/api-server/dist/index.js`

**Output files**:
- `/artifacts/api-server/dist/index.js` (compiled entry point)

**Container size**: ~60-80MB

## Environment Variables Reference

### Frontend (read at build-time)

- `BASE_PATH` — URL path prefix (default: `/`)
- `PORT` — dev server port (default: `4173`, not used in production)
- `VITE_API_BASE_URL` — backend API URL (auto-configured by DO routing)

**Note**: Frontend in production doesn't use env vars; networking is automatic via DO App Platform internal routing.

### API (read at runtime)

- `PORT` — HTTP port (default: `3001`)
- `OPENAI_API_KEY` — OpenAI API key (optional; Riley won't work without it)
- `OPENAI_MODEL` — Model name (default: `gpt-4.1-mini`)

## Troubleshooting

### Build failure: "ERR_PNPM_OUTDATED_LOCKFILE"
- **Cause**: Edited package.json but didn't run `pnpm install` locally
- **Fix**: 
  ```bash
  pnpm install
  git add pnpm-lock.yaml
  git commit -m "Update lockfile"
  git push origin main
  ```

### Build failure: TypeScript compilation error
- **Cause**: Syntax error in `.ts` files
- **Fix**: 
  ```bash
  pnpm run typecheck
  # Fix errors
  git push origin main
  ```

### Frontend works, API returns 502 Bad Gateway
- **Cause**: API container crashed or build failed
- **Fix**: Check DO console logs for API component build errors
- **Common**: Missing `OPENAI_API_KEY` shouldn't crash API (Riley is optional)

### API works but frontend can't reach it
- **Cause**: CORS issue or wrong routing
- **Fix**: Frontend requests to `/api/*` are automatically routed by DO to `fieldstate-api` service
- **Verify**: Browser DevTools → Network → API calls should show status 200 or proper error

### "Cannot connect to Docker"
- **Cause**: DO doesn't have permission to access your GitHub repo
- **Fix**: In DO console, re-authorize GitHub integration

## Performance & Costs

### Pricing (rough estimates)
- Frontend container: ~$4/month (small instance)
- API container: ~$4/month (small instance)
- Outbound bandwidth: charged per GB
- Database (unused): $0/month
- **Estimated total**: ~$10-15/month for staging

### Optimization opportunities (future)
- Disable API container if not needed (switch back to frontend-only)
- Use DO CDN for frontend assets
- Enable container auto-scaling for API if traffic spikes

## Next Steps

1. **Set OPENAI_API_KEY**:
   - Get key from OpenAI platform
   - Add to API component env vars in DO console
   - Redeploy

2. **Monitor in production**:
   - Watch DO build logs for errors
   - Monitor container resource usage
   - Test critical user workflows regularly

3. **Scale later**:
   - Add database when needed
   - Add authentication layer
   - Separate frontend CDN if bandwidth grows

## Notes

- Both components rebuild on **every push** to main branch
- Builds are **independent** — frontend can succeed while API fails (graceful degradation)
- NO automatic rollback — fix bugs and push again
- NO automatic SSL certificates — DO handles this automatically
- NO authentication — staging is public (consider adding later)
