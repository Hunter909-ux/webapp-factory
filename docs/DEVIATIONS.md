# Deviations from the Planning Documents

This file documents every deliberate deviation from the BMAD planning
documents (Architect / PM / DevOps / Design), including the reason.
Maintained by Agent 1 (Core Stack).

## 1. `@astrojs/image` replaced by built-in `astro:assets` (ADR-W7)

- **Plan:** ADR-W7 names `@astrojs/image` for image optimization.
- **Deviation:** `@astrojs/image` is deprecated and incompatible with Astro 5.
  Astro 5 ships image optimization natively via `astro:assets` (sharp,
  WebP/AVIF, responsive `srcset`).
- **Impact:** None functionally — same capability, zero extra dependency.

## 2. Local workspace moved out of Proton Drive

- **Plan/Briefing:** Workspace location was chosen next to "AI CENTRAL
  COORDINATION" (inside Proton Drive sync).
- **Deviation:** Proton Drive sync corrupted the repository: `.git/HEAD` and
  `.git/config` were renamed to "(# Name clash ... #)" duplicates and file
  writes were reverted mid-work. The workspace now lives at
  `D:\dev\webapp-factory` (SD card, reformatted from FAT32 to NTFS because
  pnpm requires junction/hardlink support).
- **Impact:** GitHub remains the single source of truth (push on every issue).

## 3. Ghost deployed as Docker image service, not the Zeabur "Ghost" template

- **Plan/Briefing:** "Ghost Service deployen (Zeabur Template 'Ghost')".
- **Deviation:** The marketplace Ghost template bundles its own MySQL
  service, which conflicts with ADR-W3 (one shared MySQL, two databases).
  Ghost is instead deployed as a plain `ghost:5-alpine` Docker service wired
  to the shared MySQL — exactly as specified in DevOps Plan section 2.2.
- **Impact:** Matches the target architecture more closely; no template
  lock-in.

## 4. Ghost persistent volume requires a manual dashboard step

- **Plan:** `/var/lib/ghost/content` on a Zeabur Persistent Volume.
- **Deviation:** The Zeabur MCP server exposes no volume-management tool.
  The volume must be attached once manually: Zeabur Dashboard → project
  `webapp-factory` → service `ghost-muscar` → Volumes →
  mount `/var/lib/ghost/content`.
- **Impact:** Until done, uploaded images are lost on service restarts.
  Database content (posts, members) is safe in MySQL either way.

## 5. First-boot note: Ghost migration lock

- **Observation (not a plan deviation):** Ghost's first boot was restarted
  mid-migration (port/domain reconfiguration), which left the knex-migrator
  lock stuck (`MigrationsAreLockedError`). Fixed by resetting
  `migrations_lock` in `ghost_muscar` — documented here in case it happens
  again for the `ghost-pwh` instance.
