# Nav, rails, dark mode, and Control Unit

**Date:** 2026-07-04
**Goal:** ship the navigation/rails overhaul, respond to live design feedback,
and populate the Control Unit project — then log directions and ship.

## Decisions
- Follow the Material dark-theme convention (warm off-white text on the
  `#1c1c1c` surface, `color-scheme: dark`) instead of pure white on black.
- Move the dark-mode toggle into the nav menu so the mobile top bar is just
  brand + hamburger.
- Right rail is pinned (no internal scroll); the long left project list keeps
  its own scroll.
- Control Unit gallery stays about the control unit; images curated from
  `local/` albums, compressed into the project folder. Raw albums stay ignored.
- `[N]` numbering, paperlib-style cards, and About tightening are deferred
  (see directions Next work).

## Changed (all shipped to `master`)
- `templates/partials/navbar.html`, `inlined_navbar_chrome.html`,
  `base_build.html`: accessible header, in-menu toggle, FOUC fix, view
  transitions + speculation-rules prefetch.
- `templates/pages/project_detail.html`, `styles/project.css`,
  `scripts/project_detail_ui.js`, `src/cvsite/builder.py`: rails, build-time
  outline (heading ids + Gallery), page-relative anchor fix.
- `styles/styles.css`, `styles/conferences.css`, `styles/sortbuttons.css`:
  softened dark palette, filter box, matched control heights.
- `templates/pages/conferences.html` + `conferences_runtime.js`,
  `data/conferences.json`, `data/publications.json`: filter + new entries.
- `projects/plasma-device-control-unit/`: full page + 7 images.
- `src/cvsite/cli.py`: threaded, no-cache dev server.

## State
- All of the above is **live** on `arseniykuzmin.github.io` (two deploys today).
- `dev` == `master`. Build is green; verified via `cvsite build` + preview
  measurements (screenshots time out on image/KaTeX-heavy pages).
- venv now has `pillow` + `pillow-heif` for HEIC handling.

## Gotchas
- `<base href="/">` breaks bare `#anchor` links — prefix with the page path.
- YAML front-matter captions must avoid `: ` (unquoted colon breaks the parse).
- `.HEIC` needs `pillow-heif`; the Inkscape `python` on PATH has Pillow but no
  pip, so install into the cvsite venv.

## Next
See `directions.md`: publications filter + paperlib-style venue-badge cards,
retire `[N]` (maybe serve `mypapers.bib`), two-column Education, leaner
Skills/Experience. User will add more project content later, unhurried.
