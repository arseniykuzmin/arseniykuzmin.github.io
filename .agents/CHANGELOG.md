# Changelog

Completed CV-site work. Keep this as the compact historical ledger; detailed
session handoffs stay in [`log/`](log/), and future work stays in
[`directions.md`](directions.md).

## 2026-07-09

### Updated JPFR publication metadata
- Added the English subtitle and direct PDF link for the 2022 Journal of Plasma
  Fusion Research Japanese review-style article, keeping DOI absent and the
  publication list structure unchanged.
- Added Ruff to the documented venv requirements and recorded the reliable
  local-preview path for future browser verification.

## 2026-07-06

### Updated seawater desalination project
- Reworked the desalination project around the outdoor collector-field hero,
  added the flow schematic/render/lab gallery, and reframed the text as a
  lab-wide 2006-2012 applied R&D side project with practical engineering
  lessons.

## 2026-07-05

### Reconciled publication metadata with paperlib
- Removed two duplicate 2010 publication rows from cvsite, added the missed
  2017 Nuclear Fusion hydrogen-recycling paper and one Russian patent entry,
  and attached the 2022 JQSRT corrigendum as a link on the original paper rather
  than counting it as a separate publication.

### Polished project/publication links and listing controls
- Added project-to-publication links using stable publication-card anchors,
  including compact project-rail labels such as "Begrambekov JNM 2013".
- Added temporary publication-card hash highlighting with Esc/timeout escape so
  linked cards are visible without staying permanently selected.
- Moved deposition-device paper context out of a formal References block and
  into concise body/rail wording.
- Added generated WebP display assets for About and project-card images, with
  lazy/eager loading tuned for faster page entry.
- Made project-detail hero figures use the default flow layout so body text
  wraps neatly beside and below the figure instead of leaving an empty column.
- Made the site theme follow the system dark/light preference until the user
  chooses a manual override.
- Replaced the large Featured control with a compact pill-style toggle and
  added a compact Corresponding role pill on publication cards.
- Curated Featured publication metadata toward old lab carbon-retention papers,
  the QUEST permeation/probe sequence, and the Fujii PoP molecular-hydrogen
  dataset paper.
- Populated boron sputtering, oxygen-removal, oxygen-retention, and X-ray
  filter project pages with fuller narrative text, gallery captions, paper /
  patent rail badges, and locally repaired PNG figures that remain readable
  without a global white image canvas.

## 2026-07-04

### Completed two-domain shipment
- Published the polished generated build to `arseniykuzmin.github.io`; the
  GitHub Pages deploy briefly failed at the opaque deploy step, then recovered
  and served the current build.
- Mirrored the generated `dist/` output into the sibling `cvpage` checkout and
  pushed `queezz.github.io`, replacing the old runtime-JS site there.
- Updated the Pages workflow to current Pages action versions
  (`configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`).
- Fixed the top-bar flash by emitting the navbar before the inline chrome
  script and initializing header behavior immediately after the header markup.
- Confirmed `queezz.github.io` no longer blinks on repeat visits; the same fix
  is present in the source build for `arseniykuzmin.github.io`.

### Polished publications, navigation, and project detail pages
- Restored citation-style publication venue lines with years, normalized
  publication title typography, and repaired compressed author formatting.
- Regularized top nav/tab widths, page title scale, and the Publications /
  Conferences filter/control layout so the listing pages align visually.
- Refined mobile nav affordances, the compact back-to-top pill, and project
  detail rails.
- Added a mobile project Details drawer so category, links, and page outline
  remain available without crowding the top of project content.
- Added compact Experience duration badges and restored institution links on
  the About page.

### Shipped publication cards and a leaner About page
- Redesigned Publications and Conferences as dark paper-style cards with venue
  badges, year/location/presentation metadata, and no shifting list numbers.
- Added live Publications search so text filters compose with year sorting and
  Featured / first-author toggles.
- Added a generated BibTeX download at `data/ArseniyKuzmin.bib`.
- Tightened About: two-column Education on desktop, chip-like Skills, more
  compact Experience cards, and cleaner expand/collapse text.

### Shipped the nav, rails, and Control Unit overhaul
Second production deploy of the day (a stack of `dev` commits merged to
`master`). Highlights:
- Accessible top nav with a real mobile hamburger (`aria-expanded`/`controls`,
  Esc / outside-click / link close); active page via `aria-current`; the
  dark-mode toggle moved into the menu; full-width mobile tap targets.
- Project-detail left/right rails: all-projects nav, a metadata card, and a
  build-time "On this page" outline. Fixed the outline anchors so they scroll
  in-page under `<base href="/">` (they were jumping to root); galleries now
  appear in the outline via a Gallery heading.
- Retired the blue scroll dot-rail. Softened dark mode to warm off-whites
  (Material convention: no pure white on near-black) and added
  `color-scheme: dark` so form controls render dark.
- Conferences: live filter box (filter/sort compose), plus the QUEST
  (Nagashima, RSI 2025) and PSI-27 (BH emission) entries.
- Populated the Control Unit project — a six-shot evolution gallery
  (spaghetti to ESP32 TC logger) and the LAN/ESP32 direction; images curated
  from the local albums (HEIC decoded via pillow-heif) and compressed.
- Shrunk oversized titles, tightened the header gap, simplified the Projects
  header.
- Build/serve robustness: threaded `cvsite serve`, no-cache headers, and a
  dist cleanup that empties in place and retries the Windows/Dropbox lock
  (`dist/` is now marked Dropbox-ignored).

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
