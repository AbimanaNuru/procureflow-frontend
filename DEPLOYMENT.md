# Deployment Guide - ProcureFlow Frontend

## The Problem

When deploying to Render, the frontend was calling `http://localhost:8000/api` instead of the production backend URL `https://procureflow-backend-onrender.com/api`.

### Root Cause

Vite embeds environment variables **at build time**, not runtime. The Docker build process wasn't receiving the `VITE_API_URL` environment variable, so it defaulted to the development value or undefined.

## The Solution

### 1. Updated Dockerfile

Added `ARG` and `ENV` declarations to accept and use environment variables during the Docker build:

```dockerfile
# Accept build arguments from Render
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_ENV

# Set environment variables for the build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_ENV=$VITE_ENV
```

**Why this works:**
- `ARG` allows Docker to receive values from the build command
- `ENV` makes these values available to the `npm run build` process
- Vite reads `VITE_*` environment variables and embeds them in the built JavaScript

### 2. Environment Variables on Render Dashboard

Environment variables are configured in your Render service dashboard (as shown in your screenshot):

- `VITE_API_URL` = `https://procureflow-backend-onrender.com/api`
- `VITE_APP_NAME` = `ProcureFlow` (optional)
- `VITE_ENV` = `production` (optional)

**Why this approach:**
- ✅ Centralized configuration in Render dashboard
- ✅ Easy to update without code changes
- ✅ Different values for different environments (staging, production)
- ✅ Render automatically passes these as `--build-arg` to Docker

## How to Deploy

### Using Render Dashboard (Recommended)

1. **Ensure environment variables are set in Render dashboard:**
   - Go to your Render service → Environment tab
   - Verify `VITE_API_URL` is set to `https://procureflow-backend-onrender.com/api`
   - (You already have this configured ✅)

2. **Commit and push the Dockerfile changes:**
   ```bash
   git add Dockerfile DEPLOYMENT.md
   git commit -m "fix: Configure Docker to accept environment variables during build"
   git push origin main
   ```

3. **Render will automatically:**
   - Detect the changes
   - Pass environment variables as build arguments to Docker
   - Build with the correct API URL
   - Deploy the updated application

### Manual Deploy (Alternative)

If you need to trigger a manual deploy:
1. Go to your Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

## Verification

After deployment, you can verify the fix by:

1. Opening your deployed frontend in the browser
2. Opening Developer Tools → Network tab
3. Attempting to login
4. Check that API calls are going to `https://procureflow-backend-onrender.com/api/users/auth/login/` instead of `localhost`

## Important Notes

### Vite Environment Variables

- **Build-time only**: Vite environment variables are embedded during build, not at runtime
- **Prefix required**: All Vite env vars must start with `VITE_`
- **No secrets**: Never put sensitive data in `VITE_*` variables (they're exposed in the client-side bundle)

### Docker Multi-stage Build

Our Dockerfile uses a multi-stage build:
1. **Stage 1 (builder)**: Builds the Vite app with environment variables
2. **Stage 2 (nginx)**: Serves the static files

Environment variables are only needed in Stage 1 (builder).

### Local Development

For local development, continue using your `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=ProcureFlow
VITE_ENV=development
```

The `.env` file is NOT used in Docker builds - only `ARG` and `ENV` in the Dockerfile.

## Troubleshooting

### Still seeing localhost in production?

1. Clear your browser cache
2. Check Render build logs to confirm environment variables are set
3. Verify the build completed successfully
4. Check the Network tab to see actual API calls

### Environment variables not working?

1. Ensure variable names start with `VITE_`
2. Check that `ARG` declarations are BEFORE `RUN npm run build`
3. Verify `render.yaml` has correct indentation (YAML is sensitive)
4. Check Render dashboard for any build errors

## References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Docker ARG vs ENV](https://docs.docker.com/engine/reference/builder/#arg)
- [Render Environment Variables](https://render.com/docs/environment-variables)
