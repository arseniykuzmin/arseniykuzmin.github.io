# Directions - CV site cleanup

Forward-looking map: where things stand and what's next. Detailed session
records are in [`log/`](log/); the full background dig is
[`CV_SITE_ARCHAEOLOGY_2026-07-02.md`](CV_SITE_ARCHAEOLOGY_2026-07-02.md).

## TL;DR for the next session
Cleaning up (not rebuilding) the CV site. A working custom **Jinja2 static
site** (`build.py`) is the keeper; the old runtime-JS pages and the Chirpy
trial are being retired/parked. Repo/branch admin + a build venv are **done**.
Phase 1 has been implemented locally on `arseniykuzmin.github.io/dev`: the
Jinja build now creates a self-contained ignored `dist/`, a GitHub Pages Action
is in place, and Gen-1 runtime pages/scripts were retired. It has been rebuilt
and served locally, but **nothing has been pushed; the live sites are still the
old version.**

## Confirmed decisions
- **Keep the custom Jinja2 build** (`arseniykuzmin.github.io/dev`); drop Chirpy
  from the CV. Chirpy is parked for a **future blog** on `cvpage` branch
  `blog-chirpy` (+ the `chirpy` remote).
- **CV live at BOTH URLs** (arseniykuzmin.github.io and queezz.github.io) - a
  mirror, one source of truth.
- **Deploy via GitHub Action** (build on push, publish `dist/`) - not manual,
  not committed output.
- **User rules:** never push before testing locally. Commits: no
  `Co-Authored-By`; end with `agent: <model>` (see
  [`commit-culture.md`](commit-culture.md)).

## Assumed defaults (confirm with user; otherwise proceed on these)
- **Source of truth = `arseniykuzmin.github.io`** (build.py + freshest data
  already there).
- **Work on `dev`; when good, merge `dev` -> `master`; the Action deploys from
  `master`.**

## Current state (2026-07-04)
- **arseniykuzmin.github.io**: on `dev`. Phase 1 is implemented locally:
  `build.py` produces a self-contained `dist/`, `.github/workflows/pages.yml`
  deploys Pages from `dist/`, tracked `dist/` has been removed from the index,
  and Gen-1 runtime pages/scripts were deleted. The project has also moved to a
  `src/cvsite` package with `cvsite build` / `cvsite serve`, and loose root
  assets were moved to `static/`.
- **Agents:** active `.agents/` notes now live in this repo. The sibling
  `cvpage/.agents` copy is historical/unpushed context.
- **Working tree note:** `cv.code-workspace` has a pre-existing local edit
  (**not ours - leave it**). Nothing pushed.
- **Build venv:** use `$env:USERPROFILE\.venvs\cvsite`.

## Key technical note
`build.py` now assembles a self-contained `dist/`: shared `styles/`, `img/`,
required `scripts/`, root image/favicon files, `.nojekyll`, and project-local
media are copied into the artifact. Generated pages use `base href="/"`, so
preview `dist/` through a local server rather than by double-clicking HTML.

## Plan

### Phase 1 - build & deploy `arseniykuzmin.github.io` (local complete; no push)
1. Done: upgraded `build.py` to produce a self-contained `dist/`.
2. Done: added `.github/workflows/pages.yml`.
3. Done: removed `dist/` from the index and ignored generated output.
4. Done: retired Gen-1 runtime pages/scripts. `project_detail_ui.js` was kept
   because generated project pages still reference it.
5. Done: fixed canonical/alternate/OG URLs for the source site plus mirror.
6. Done: rebuilt and served locally; see
   [`log/2026-07-03-phase-1-local-deploy-cleanup.md`](log/2026-07-03-phase-1-local-deploy-cleanup.md).

### Phase 1b - Python project tooling (local complete; no push)
Done locally:
- Added `pyproject.toml`.
- Moved builder code into `src/cvsite/builder.py`.
- Added CLI entry point:
  - `cvsite build` -> rebuild `dist/`.
  - `cvsite serve` -> build and serve `dist/` as the web root.
  - Options: `--port`, `--host`, `--no-build`.
- Kept `build.py` as a thin compatibility wrapper.
- Updated GitHub Action to run `cvsite build`.
- Updated `requirements.txt` to install the package (`-e .`).
- Moved loose root assets (`favicon.ico`, `kaa.jpg`, `kaa.png`) into `static/`
  and updated templates/metadata to reference `static/...`.

Verified:
- `cvsite build` works after editable install into the project venv.
- `cvsite serve --no-build --port 8777` served `projects.html` with HTTP 200.
- Generated local href/src integrity check passed: 313 refs.

See [`log/2026-07-04-src-package-and-static-assets.md`](log/2026-07-04-src-package-and-static-assets.md).

### Phase 2 - mirror to `queezz.github.io` (needs the user)
Extend the Action to also publish `dist/` to `queezz/queezz.github.io`. The
repos are under different accounts, so this needs a **cross-repo deploy token**
(PAT or deploy key) as a repo secret - **the user must create it** (agent can't;
`gh` isn't installed). Until then, `queezz.github.io` stays live on its current
content.

### Phase 3 - cosmetics / performance / UI regularity (against the clean build)
- **Perf:** ~13.9 MB of images (several 1-2 MB PNGs) -> resize + WebP/AVIF +
  `srcset` (biggest win). Dedupe images duplicated across `img/` and
  `projects/<slug>/`.
- **CSS:** consolidate the 9 stylesheets; hoist the color/dark-mode palette to
  CSS variables; replace the `moveProfileIfNeeded` JS layout hack with CSS.
- **Regularity:** consistent section/figure/card spacing + type scale.
- Full findings: archaeology section 5 through section 7.

### Phase 3b - navigation and rails
The current nav is still hacked together: a fixed top bar, inline hamburger
logic, and the old right-side dot/progress "on this page" nav. Replace this
with a deliberate navigation system.

Recommended structure:
- **Global top nav:** keep top-level tabs (`About`, `Conferences`,
  `Publications`, `Projects`) on desktop. Normalize active state, spacing,
  dark-mode behavior, and keyboard focus. Remove inline `onclick` in favor of a
  small, explicit nav script or inline module.
- **Mobile nav:** use a real hamburger button with `aria-expanded`,
  `aria-controls`, escape/overlay behavior if needed, and predictable full-width
  menu. Avoid relying on the current fixed 20px navbar hack.
- **Project detail left rail:** desktop-only rail listing project navigation:
  back to all projects plus nearby/all project titles. It should answer "where
  am I in the project collection?" without forcing the user back to the grid.
- **Right rail on project detail:** desktop-only rail with:
  - a compact project metadata card (`year` or `period`, `topic`, `lab`,
    `related paper`, optional collaborators/co-authors), only when data exists;
  - an "On this page" outline generated from headings in the project markdown.
- **Right rail on long non-project pages:** use a real text outline for sections
  instead of the dot/progress rail. Hide on mobile.
- **Mobile for rails:** collapse rails away. Put project metadata below the hero
  or title, and rely on page flow plus the hamburger/global nav.

Data implications:
- Add optional structured fields to `data/projects.json`, for example:
  `period`, `topic`, `lab`, `collaborators`, `relatedPaper`, `relatedUrl`.
- Do not invent years where the source is unclear. Use categories/topics until
  reliable date ranges are available.

Implementation preference:
- Generate outlines at build time from rendered headings where possible. Use JS
  only for active-section highlighting and mobile menu behavior.
- Remove or retire `styles/scrollnav.css` and `scripts/scrollnav.js` once the
  replacement outline exists.
- Keep rails desktop-only (`min-width` breakpoint around 1100-1200px) so the
  main text does not become cramped.

Risk to watch:
- A 3-column layout can easily make the project pages feel like a dashboard.
  Keep rails quiet, narrow, and secondary; the project content and images should
  remain the visual center.

## Things that need the user (don't block Phase 1)
- Confirm the two assumed defaults (source repo; `dev` -> `master` deploy flow).
- Phase 2 deploy token for the queezz mirror.
- Decide whether to retire or leave the historical `.agents` copy in
  `cvpage/master`.
- Whether the future blog stays on `queezz.github.io` or moves (affects the
  "both live" URL split).
