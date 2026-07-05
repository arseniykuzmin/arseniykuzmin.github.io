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

Shipped and live on both `arseniykuzmin.github.io` and `queezz.github.io`:
the Jinja2 build, accessible top nav + mobile hamburger, project-detail rails
with a build-time "On this page" outline, softened dark mode,
Publications/Conferences card lists with live filters, a tighter About page,
the QUEST/PSI publications, a populated Control Unit project, polished
publication/conference listing alignment, a mobile project Details drawer, and
the navbar initialization flash fix. Newer `dev` polish includes compact
publication-card role/filter pills, project-to-publication card links, a first
WebP image pass, and system-following theme initialization.

## Confirmed decisions
- **Source of truth:** `arseniykuzmin.github.io`.
- **Build system:** custom Jinja2 static generator, exposed through `cvsite`.
- **Deployment:** `arseniykuzmin.github.io` builds and deploys from `master`
  via GitHub Actions. `queezz.github.io` was manually refreshed from the
  generated `dist/` output in the sibling `cvpage` checkout.
- **URLs:** keep CV live at both `arseniykuzmin.github.io` and
  `queezz.github.io`.
- **Blog:** Chirpy is not part of the CV cleanup. It remains parked for a
  possible future blog.
- **Commits:** no `Co-Authored-By`; agent commits end with an `agent:` line
  naming the model (e.g. `agent: claude opus 4.8`).
- **Push rule:** do not push before local testing and explicit user approval.

## Current state
- Work branch: `dev`. `master` now holds the shipped build and deploys via the
  GitHub Pages Action on every push.
- Deployment reminder: pushing `dev` alone does not update the live site. For
  user-visible fixes, fast-forward `master` to `dev` and push `master`; then
  allow the Pages Action a short time to finish.
- The `cvsite` Jinja2 build is live on both public URLs.
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
- Project pages should not grow manuscript-style `References` sections unless
  the user explicitly asks for formal bibliography prose. Put publication
  relationships in `data/projects.json` via `relatedPublicationDois`; use
  `relatedPublicationLabels` / `relatedPublicationNotes` for human wording in
  project rails and the mobile Details drawer. Full citation metadata and DOI
  links belong on `publications.html` publication cards.
- Scientific PNGs should stand on their own. If a figure has floating labels,
  transparent regions, or dark text, prepare the image asset so it remains
  readable on the site background; do not add a global white canvas behind all
  project/gallery images.

## Next work

### 1. Optional automated mirror
The `queezz.github.io` mirror is live after a manual refresh from `dist/`.
If automatic mirroring is wanted later, extend the Action to publish `dist/` to
`queezz/queezz.github.io`. Because the repos are under different accounts, this
needs a cross-repo deploy token or deploy key stored as a repo secret.

### 2. Performance and visual regularity
- Broaden image optimization beyond the first generated WebP pass; consider
  AVIF and richer `srcset` where it is worth the extra build complexity.
- Dedupe images duplicated across `img/` and `projects/<slug>/`.
- Consolidate stylesheets and introduce shared CSS variables.
- Continue regularizing section spacing, figure spacing, card layout, and type
  scale.

### 3. Project content details
- Fill in missing project metadata/details where available, especially periods,
  links, tags, and short project-specific notes for the mobile Details drawer.

## Open user decisions
- Whether to retire, archive, or leave the historical `.agents` copy in
  `cvpage`.
- Whether to automate the `queezz.github.io` mirror with a cross-repo deploy
  token/secret, or keep refreshing it manually from the local `cvpage` checkout.
- Whether the future blog stays on `queezz.github.io` or moves elsewhere.
