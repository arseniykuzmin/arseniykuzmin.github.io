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

Shipped and live on `arseniykuzmin.github.io` via the GitHub Pages Action:
the Jinja2 build, plus (2026-07-04) an accessible top nav + mobile hamburger,
project-detail rails with a build-time "On this page" outline, softened dark
mode, a Conferences filter, the QUEST/PSI publications, and a fully populated
Control Unit project. The `queezz.github.io` mirror still needs its Phase 2
token.

## Confirmed decisions
- **Source of truth:** `arseniykuzmin.github.io`.
- **Build system:** custom Jinja2 static generator, exposed through `cvsite`.
- **Deployment:** GitHub Action builds on push and publishes `dist/`.
- **URLs:** keep CV live at both `arseniykuzmin.github.io` and
  `queezz.github.io`; the mirror needs a Phase 2 token/secret.
- **Blog:** Chirpy is not part of the CV cleanup. It remains parked for a
  possible future blog.
- **Commits:** no `Co-Authored-By`; agent commits end with an `agent:` line
  naming the model (e.g. `agent: claude opus 4.8`).
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

### 2. Publications & Conferences as cards
Redesign both list pages to look like the user's paperlib (a dark card grid;
see the 2026-07-04 handoff for a reference screenshot). Each entry becomes a
card: the title, an emoji or two in place of boilerplate labels where it reads
well, and a coloured **badge for the venue** — a short journal/conference code
matching `journals.toml` in the paperlib library at
`C:\Users\queezz\Dropbox\10-Research\40-Articles-Library\`.

- **Publications filter:** add the same live filter box already on Conferences.
  `templates/partials/conferences_runtime.js` is the working template — it
  filters by title/authors/venue/year and updates the count; re-render from the
  embedded JSON on load so filter + sort compose.
- **Retire the `[N]` number** on each card. It shifts as you filter and this is
  not a bibliography. If people want citations, just serve the full BibTeX
  (`data/mypapers.bib`) as a downloadable file instead of pretending to be a
  reference manager.

### 3. Tighten the landing page (About)
The About page feels busy; exact direction still open.
- Put **Education** in two side-by-side cards on desktop to save vertical space.
- Make **Skills** and **Experience** more concise / less dense.

### 4. Performance and visual regularity
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
