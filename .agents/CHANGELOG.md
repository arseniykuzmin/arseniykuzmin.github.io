# Changelog

Completed CV-site work. Keep this as the compact historical ledger; detailed
session handoffs stay in [`log/`](log/), and future work stays in
[`directions.md`](directions.md).

## 2026-07-04

### Shipped the cvsite build to production
- Verified `cvsite build` green: 4 top-level pages, 15 project detail pages,
  `.nojekyll` copied, and `<base href="/">` in generated HTML.
- Confirmed clean working tree with `dist/` ignored.
- Merged `dev` into `master` (fast-forward, 8 commits) and pushed `master`.
- The GitHub Pages Action builds and deploys `dist/`, so
  `arseniykuzmin.github.io` now serves the Jinja2 `cvsite` build instead of the
  old runtime-JS pages.
- Mirror to `queezz.github.io` remains deferred pending the Phase 2 deploy
  token.

### Normalized agent landing spots
- Added root `AGENTS.md` as the first-read landing page for agents.
- Made `.agents/README.md` point to the root landing page and clarify
  directions vs changelog vs logs.
- Expanded `.agents/commit-culture.md` with explicit authorship, staging,
  verification, no-push, no-tag, and machine-independent docs rules.
- Scrubbed older agent notes so they avoid username-specific local paths.

### Moved active agent notes into source repo
- Copied `.agents/` into `arseniykuzmin.github.io`.
- Updated `.agents/README.md`, `.agents/commit-culture.md`, and
  `.agents/directions.md` so this repo is now the active home for directions
  and handoffs.
- Added `log/2026-07-04-move-agents-into-source-repo.md`.

### Converted builder to a Python package
- Added `pyproject.toml`.
- Moved build logic into `src/cvsite/builder.py`.
- Added `cvsite` CLI:
  - `cvsite build`
  - `cvsite serve`
  - `cvsite serve --port <port>`
  - `cvsite serve --no-build`
- Kept `build.py` as a compatibility wrapper.
- Updated `requirements.txt` to install the package with `-e .`.
- Updated GitHub Actions to run `cvsite build`.
- Verified `cvsite build`, `cvsite serve --no-build --port 8777`, and 313
  generated local href/src references.

### Moved loose assets into `static/`
- Moved root `favicon.ico`, `kaa.jpg`, and `kaa.png` to `static/`.
- Updated templates and Open Graph metadata to reference `static/...`.
- Updated `data/image-sizes.json` for `static/kaa.png`.

### Improved projects UI
- Reworked the projects grid with stable media wells, calmer cards,
  category metadata, and responsive/dark-mode styling.
- Reworked project detail pages with stronger title/summary hierarchy, framed
  hero media, cleaner long text, gallery styling, and mobile behavior.
- Added `category` metadata to `data/projects.json`.
- Captured Chrome screenshots for desktop/mobile project index and desktop
  project detail views.

## 2026-07-03

### Completed local Phase 1 deploy cleanup
- Made the Jinja build generate a self-contained `dist/`.
- Added GitHub Pages workflow for building and deploying `dist/`.
- Removed tracked `dist/` output from the index and ignored generated output.
- Retired Gen-1 runtime HTML pages and old fetch-based scripts.
- Fixed canonical/alternate/Open Graph URLs for the source site and mirror.
- Verified local build, served preview, and generated href/src references.

## 2026-07-02

### Established cleanup direction
- Confirmed custom Jinja2 static build as the keeper.
- Parked Chirpy for possible future blog work.
- Documented two-repo history and cleanup archaeology.
- Cleaned branch/repo admin context.
- Added initial `.agents` operational notes in the sibling `cvpage` repo before
  moving active notes into this source repo.
