# Directions - CV site cleanup

Forward-looking map: current state, decisions, and next work. Completed
milestones are in [`CHANGELOG.md`](CHANGELOG.md); detailed session records are
in [`log/`](log/); background archaeology is in
[`CV_SITE_ARCHAEOLOGY_2026-07-02.md`](CV_SITE_ARCHAEOLOGY_2026-07-02.md).

## TL;DR
The CV site now has a custom Jinja2 static build packaged as `cvsite`.
Generated output is ignored and rebuilt into `dist/`. The old runtime-JS pages
have been retired locally, static root assets moved into `static/`, and active
agent notes now live in this repo.

Shipped: `dev` was merged to `master` and pushed. The GitHub Pages Action
builds and deploys `dist/`, so `arseniykuzmin.github.io` now serves the new
Jinja2 build. The `queezz.github.io` mirror is still pending its Phase 2 token.

## Confirmed decisions
- **Source of truth:** `arseniykuzmin.github.io`.
- **Build system:** custom Jinja2 static generator, exposed through `cvsite`.
- **Deployment:** GitHub Action builds on push and publishes `dist/`.
- **URLs:** keep CV live at both `arseniykuzmin.github.io` and
  `queezz.github.io`; the mirror needs a Phase 2 token/secret.
- **Blog:** Chirpy is not part of the CV cleanup. It remains parked for a
  possible future blog.
- **Commits:** no `Co-Authored-By`; agent commits end with `agent: gpt-5 codex`.
- **Push rule:** do not push before local testing and explicit user approval.

## Current state
- Work branch: `dev`. `master` now holds the shipped build and deploys via the
  GitHub Pages Action on every push.
- The `cvsite` Jinja2 build is live on `arseniykuzmin.github.io`.
- Active `.agents/` notes are in this repo.
- Historical/unpushed `.agents` notes still exist in sibling `cvpage`.
- `cv.code-workspace` has a pre-existing local edit; leave it out of commits
  unless the user explicitly asks.
- Preferred local commands:
  - `cvsite build`
  - `cvsite serve`
  - `cvsite serve --port 9000`
  - `cvsite serve --no-build`
- Build venv: `$env:USERPROFILE\.venvs\cvsite`.

## Technical notes
- `dist/` is generated output and must stay ignored.
- Generated HTML uses `<base href="/">`, so local preview must serve `dist/` as
  the web root.
- `build.py` is only a compatibility wrapper; the real implementation is under
  `src/cvsite/`.
- On Windows, an active preview server can hold handles under `dist/`; stop the
  server before manually rebuilding. `cvsite serve` builds before serving.
- Root deployment metadata `.nojekyll` stays at repo root and is copied to
  `dist/`; media assets belong under `static/`, `img/`, or project folders.

## Next work

### 1. Mirror to `queezz.github.io`
Extend the Action to also publish `dist/` to `queezz/queezz.github.io`.
Because the repos are under different accounts, this needs a cross-repo deploy
token or deploy key stored as a repo secret. The user must create/provide this.

### 2. Navigation and rails
Replace the current hacked navigation with a deliberate system:

- **Global top nav:** keep `About`, `Conferences`, `Publications`, `Projects`
  on desktop; normalize active state, spacing, dark mode, and focus behavior.
- **Mobile nav:** implement a real hamburger button with `aria-expanded`,
  `aria-controls`, predictable menu behavior, and no 20px fixed-navbar hack.
- **Project detail left rail:** desktop-only project collection navigation,
  including back to all projects and nearby/all project titles.
- **Project detail right rail:** desktop-only metadata card plus real
  "On this page" outline.
- **Long non-project pages:** use a text outline instead of the dot/progress
  rail. Hide rails on mobile.
- **Mobile rails:** collapse rails away; put metadata in normal content flow.

Data needed for project metadata:
- Optional fields in `data/projects.json`: `period`, `topic`, `lab`,
  `collaborators`, `relatedPaper`, `relatedUrl`.
- Do not invent years. Use category/topic labels until reliable date ranges are
  available.

Implementation preference:
- Generate outlines at build time from headings where practical.
- Use JS only for active-section highlighting and mobile menu behavior.
- Retire `styles/scrollnav.css` and `scripts/scrollnav.js` once the replacement
  outline exists.
- Keep rails quiet and secondary; the project content/images remain primary.

### 3. Performance and visual regularity
- Resize/compress large images; consider WebP/AVIF and `srcset`.
- Dedupe images duplicated across `img/` and `projects/<slug>/`.
- Consolidate stylesheets and introduce shared CSS variables.
- Continue regularizing section spacing, figure spacing, card layout, and type
  scale.

## Open user decisions
- Whether to retire, archive, or leave the historical `.agents` copy in
  `cvpage`.
- Cross-repo deploy token/secret for the `queezz.github.io` mirror.
- Whether the future blog stays on `queezz.github.io` or moves elsewhere.
