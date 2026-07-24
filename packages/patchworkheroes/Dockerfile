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

ARG GHOST_URL=http://ghost-pwh.zeabur.internal:2368
ENV GHOST_URL=${GHOST_URL}
ARG GHOST_CONTENT_KEY=placeholder
ENV GHOST_CONTENT_KEY=${GHOST_CONTENT_KEY}
ARG GHOST_ADMIN_KEY=placeholder
ENV GHOST_ADMIN_KEY=${GHOST_ADMIN_KEY}
ARG PUBLIC_SITE_URL=https://patchworkheroes.de
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}
ARG PUBLIC_PLAUSIBLE_DOMAIN=patchworkheroes.de
ENV PUBLIC_PLAUSIBLE_DOMAIN=${PUBLIC_PLAUSIBLE_DOMAIN}
ARG PUBLIC_MAILERLITE_ACCOUNT_ID=
ENV PUBLIC_MAILERLITE_ACCOUNT_ID=${PUBLIC_MAILERLITE_ACCOUNT_ID}
ARG PUBLIC_MAILERLITE_FORM_ID=
ENV PUBLIC_MAILERLITE_FORM_ID=${PUBLIC_MAILERLITE_FORM_ID}

# Debug: verify build-time env injection (remove after verification).
RUN node -e "console.log('ENV CHECK GHOST_URL=', process.env.GHOST_URL, 'GHOST_CONTENT_KEY=', (process.env.GHOST_CONTENT_KEY || '').slice(0,5), 'GHOST_ADMIN_KEY=', (process.env.GHOST_ADMIN_KEY || '').slice(0,5))"

RUN pnpm --filter @webapp-factory/patchworkheroes build

FROM nginx:alpine
COPY --from=builder /app/packages/patchworkheroes/dist /usr/share/nginx/html
COPY --from=builder /app/packages/patchworkheroes/public/_headers /usr/share/nginx/html/_headers
EXPOSE 80
