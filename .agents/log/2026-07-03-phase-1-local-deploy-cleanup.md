# Phase 1 local deploy cleanup

**Date:** 2026-07-03
**Goal:** make the custom Jinja2 CV build deployable from GitHub Actions.

## Decisions
- Keep `project_detail_ui.js` because generated project pages still use it for
  gallery lightbox behavior and KaTeX rendering.
- Use `arseniykuzmin.github.io` canonical URLs and `queezz.github.io`
  alternate links until the mirror deployment token exists.
- Keep the pre-existing `arseniykuzmin.github.io/cv.code-workspace` edit
  untouched.

## Changed
- `arseniykuzmin.github.io/build.py` now resets `dist/`, copies static assets,
  copies project-local media, and renders pages with `base href="/"`.
- Added `arseniykuzmin.github.io/.github/workflows/pages.yml` to build and
  deploy `dist/` with GitHub Pages on `master` pushes and manual dispatches.
- Added `arseniykuzmin.github.io/.gitignore` and removed tracked `dist/`
  output from the index with `git rm --cached -r dist`.
- Retired Gen-1 runtime pages and fetch-based scripts:
  root HTML pages, old project `index.html` files, `backup.html`,
  `sidemenu.html`, `templates/base.html`, `scripts/about.js`,
  `scripts/conferences.js`, `scripts/navbar.js`, `scripts/project.js`,
  `scripts/projects.js`, `scripts/publications.js`, `scripts/sidemenu.js`,
  and `styles/sidemenu.css`.

## State
- Build passes with `C:\Users\queezz\.venvs\bh\Scripts\python.exe build.py`.
- Generated `dist/` is present locally and ignored by Git.
- Internal generated href/src integrity check passed: 294 local references.
- Local preview at `http://127.0.0.1:8765/` returned HTTP 200 for:
  `/`, `/projects.html`, `/publications.html`, `/conferences.html`,
  `/projects/deposition-device/`, shared CSS/JS, and representative root and
  project images.
- In-app browser attachment failed with a local `EPERM` on
  `C:\Users\queezz\AppData`, so visual smoke testing was limited to served HTTP
  checks.
- Nothing has been pushed.

## Next
- Review the local preview manually at `http://127.0.0.1:8765/`.
- Commit `arseniykuzmin.github.io` changes when satisfied, then merge
  `dev` to `master` and push to let the Pages Action deploy.
- Phase 2 still needs a cross-repo deploy token/secret for the
  `queezz.github.io` mirror.
