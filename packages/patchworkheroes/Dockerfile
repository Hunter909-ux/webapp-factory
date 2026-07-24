# Production Dockerfile for patchworkheroes.de — Zeabur static build.
# Builds the Astro site and serves it with nginx.

FROM node:22-slim AS builder
WORKDIR /app

# Enable pnpm via corepack (matching the workspace packageManager version).
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

COPY . .

# Install workspace dependencies and build the patchworkheroes package.
# Public env vars are injected by Zeabur at build time.
RUN pnpm install --frozen-lockfile

ENV GHOST_URL=http://ghost-pwh.zeabur.internal:2368
ENV GHOST_CONTENT_KEY=placeholder
ENV PUBLIC_SITE_URL=https://patchworkheroes.de
ENV PUBLIC_PLAUSIBLE_DOMAIN=patchworkheroes.de
ENV PUBLIC_MAILERLITE_ACCOUNT_ID=
ENV PUBLIC_MAILERLITE_FORM_ID=

RUN pnpm --filter @webapp-factory/patchworkheroes build

FROM nginx:alpine
COPY --from=builder /app/packages/patchworkheroes/dist /usr/share/nginx/html
COPY --from=builder /app/packages/patchworkheroes/public/_headers /usr/share/nginx/html/_headers
EXPOSE 80
