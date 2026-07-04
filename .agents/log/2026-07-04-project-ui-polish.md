# Project UI polish

**Date:** 2026-07-04
**Goal:** make the projects index and project detail pages feel calmer, more
grounded, and less hacked together.

## Decisions
- Use stable, contained media wells for project cards because the current assets
  mix photos, plots, screenshots, CAD renders, and microscope/SEM images.
- Keep the design restrained: neutral surfaces, maroon site accent, muted green
  metadata, 8px radii, and real project imagery as the visual anchor.
- Add project summary to detail pages directly under the title so the transition
  from card to project page has continuity.
- Replace numeric "Project N" labels with factual project categories. The data
  can later use year ranges in the same slot if better dates are available.

## Changed
- `templates/pages/projects.html` now renders a structured projects section,
  header, media figure, card body, and category label for each card.
- `data/projects.json` now includes `category` values for project card/detail
  metadata.
- `styles/projects.css` was replaced with a responsive card system, stable image
  wells, hover/focus states, and dark-mode overrides.
- `templates/pages/project_detail.html` now wraps detail pages in a project
  detail section and fixes the back link for the generated `base href="/"`.
- `build.py` now emits a project header with project number, title, and summary
  before each detail page body.
- `styles/project.css` was reworked for stronger detail-page hierarchy, framed
  hero media, cleaner long text, tables, gallery thumbnails, mobile behavior,
  and dark-mode overrides.

## State
- Build passes with `C:\Users\queezz\.venvs\bh\Scripts\python.exe build.py`.
- Generated href/src integrity check passed: 294 local references.
- Local server at `http://127.0.0.1:8765/` returned HTTP 200 for the projects
  page, a project detail page, and the new project CSS files.
- Screenshot automation ran with system Chrome at
  `C:\Program Files\Google\Chrome\Application\chrome.exe` via Playwright
  `executablePath`. Captured desktop/mobile project index screenshots and a
  desktop project detail screenshot under ignored local `dist/`.
- Nothing has been pushed.

## Next
- Manually inspect `http://127.0.0.1:8765/projects.html` and one or two detail
  pages.
- If desired, replace or crop project thumbnails around the new 16:10 card media
  well; the layout is stable without that, but custom crops will polish it.
