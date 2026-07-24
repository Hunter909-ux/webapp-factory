# Production Dockerfile for muscar.ai — Issue #15.
# Builds the Astro static site and serves it with nginx.
# The build context is the repository root; this Dockerfile lives in
# packages/muscar-ai so the service root can point here.

FROM node:22-slim AS builder
WORKDIR /app

# Enable pnpm via corepack (matching the packageManager version in package.json).
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY . .

# Install dependencies for the whole workspace.
RUN pnpm install --frozen-lockfile

# Build only the muscar-ai package. The Ghost content key is injected at build
# time by Zeabur; the site is written to tolerate a missing key (empty list).
ENV GHOST_URL=https://ghost-muscar-wf.zeabur.app
ENV PUBLIC_SITE_URL=https://muscar.ai
ENV PUBLIC_PLAUSIBLE_DOMAIN=muscar.ai
# Forward Zeabur service variables into the build container so Vite can
# inline them for the SSG step (Issue #20).
ARG GHOST_CONTENT_KEY
ARG GHOST_ADMIN_KEY
ENV GHOST_CONTENT_KEY=${GHOST_CONTENT_KEY}
ENV GHOST_ADMIN_KEY=${GHOST_ADMIN_KEY}
RUN pnpm --filter @webapp-factory/muscar-ai build

FROM nginx:alpine
COPY --from=builder /app/packages/muscar-ai/dist /usr/share/nginx/html
COPY --from=builder /app/packages/muscar-ai/public/_headers /usr/share/nginx/html/_headers
EXPOSE 80
