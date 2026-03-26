# Deploying FieldState Full Stack to DigitalOcean

## Summary of Changes

This repo now includes **Dockerfiles** for both frontend and API, plus a `.do/app.yaml` spec that deploys both services to DigitalOcean App Platform as separate components.

### New Files
- `Dockerfile.frontend` - Multi-stage build for React SPA
- `Dockerfile.api` - Multi-stage build for Express API
- `.do/app.yaml` - DigitalOcean App Platform configuration
- `docs/digitalocean-staging-multi.md` - Detailed deployment guide

### Modified Files
- `artifacts/api-server/src/index.ts` - Made PORT optional with default `3001`

## Deployment Steps

### 1. Commit and Push

```bash
git add -A
git commit -m "Add full-stack Docker deployment for DigitalOcean"
git push origin main
```

### 2. First-Time Setup in DigitalOcean

1. **Go to App Platform** → Create New App
2. **Connect GitHub**: Select `brettsmith/FieldState`, branch `main`
3. **Auto-Detection**: DO should detect `.do/app.yaml` and propose 2 components
4. **Confirm Components**:
   - `fieldstate-frontend` (Dockerfile.frontend) on port 4173
   - `fieldstate-api` (Dockerfile.api) on port 3001
5. **Environment Variables** → Add to `fieldstate-api`:
   - Key: `OPENAI_API_KEY`
   - Value: *your OpenAI API key*
6. **Deploy**

### 3. After Initial Deployment

Within 10-15 minutes, you'll have two public URLs:
- Frontend: `https://fieldstate-frontend-xxx.ondigitalocean.app`
- API: `https://fieldstate-api-xxx.ondigitalocean.app`

### 4. Connect Frontend to API (Post-Deploy)

The frontend needs to know where the API lives. Two options:

#### Option A: Use Frontend with Local Fallback (Quick)
- Frontend ships with local Riley fallback
- If API isn't configured, UI still works but Riley uses in-browser simulation
- **No additional config needed** ✅

#### Option B: Full API Integration (Better)
1. Note the API service public URL from DO console (e.g., `https://fieldstate-api-xyz.ondigitalocean.app`)
2. Edit frontend component → Environment Variables
3. Add: `VITE_API_BASE_URL=https://fieldstate-api-xyz.ondigitalocean.app`  
4. Redeploy frontend

**When to use which**:
- **Option A** if you just want the UI live for review
- **Option B** if you want real Riley AI integration working

## Architecture

```
Your Local Machine
        ↓ git push main
        ↓
GitHub repo (brettsmith/FieldState)
        ↓ webhook
        ↓
DigitalOcean App Platform
├── Component 1: fieldstate-frontend
│   ├── Dockerfile.frontend
│   ├── pnpm install + vite build
│   └── Serves: https://fieldstate-frontend-xxx.ondigitalocean.app
│
└── Component 2: fieldstate-api
    ├── Dockerfile.api
    ├── pnpm install + typescript compile + esbuild bundle
    └── Serves: https://fieldstate-api-xxx.ondigitalocean.app
```

## What Each Dockerfile Does

### Dockerfile.frontend
1. **Build stage**: Installs pnpm, copies workspace, runs `pnpm install --frozen-lockfile`
2. **Build command**: `pnpm --filter @workspace/fieldstate build`
3. **Output**: Optimized React bundle in `artifacts/fieldstate/dist/public`
4. **Runtime**: Node container with `serve` package → serves static assets

**Result**: Lightweight static SPA, ~15-20MB image

### Dockerfile.api
1. **Build stage**: Same install process, then compiles TypeScript and bundles with esbuild
2. **Build command**: `pnpm --filter @workspace/api-server build`
3. **Output**: Minified bundle in `artifacts/api-server/dist/index.cjs`
4. **Runtime**: Node container → runs compiled bundle, listens on port 3001

**Result**: Minimal API server, ~60-80MB image

## Testing

### Test Frontend
```bash
curl https://fieldstate-frontend-xxx.ondigitalocean.app
# Should return HTML with <title>FieldState</title>
```

### Test API Health
```bash
curl https://fieldstate-api-xxx.ondigitalocean.app/api/healthz
# Should return: {"ok":true,"version":"0.0.0"}
```

### Test API + Frontend Integration
1. Open frontend in browser
2. Click "Summon" to open Riley interface
3. Type a message
   - If API configured: Calls real API (requires OPENAI_API_KEY set)
   - If API not configured: Uses browser-local fallback

## Updating Your App

Every push to main automatically redeploys both services:

```bash
# Make any changes locally
git add .
git commit -m "Your update"
git push origin main
# → Automatically rebuilds and redeploys both frontend + API
```

## Troubleshooting

### Build fails: pnpm lockfile error
```bash
pnpm install  # Regenerate lockfile locally
git add pnpm-lock.yaml
git push origin main
```

### Build fails: TypeScript errors
```bash
pnpm run typecheck  # Check locally first
# Fix errors, then push
```

### Frontend works, API returns 502
- Check API build logs in DO console
- Verify `OPENAI_API_KEY` is set (optional but might help debugging)
- API should start even without key; check error logs

### Frontend can't reach API
- **If using Option A** (local fallback): This is expected, UI still works
- **If using Option B**: Verify `VITE_API_BASE_URL` is set correctly in frontend env vars
- Test with: `curl https://fieldstate-api-xxx.ondigitalocean.app/api/healthz`

## Next Steps

1. **Push to main**: Triggers automatic build + deploy
2. **Monitor build logs**: Check DO console for any errors (usually ready in 10-15 min)
3. **Test the frontend**: Open the public URL and verify UI loads
4. **Decide on API integration**: Use Option A (local fallback) or Option B (real API)
5. **Add OPENAI_API_KEY**: Once working, add your key to API environment variables
