# CV Site — Archaeology

*Private working notes. Location: `Dropbox/JobHunting/` (not inside either git repo → never pushed).*
*Compiled: 2026-07-02. No files were modified in either repo to produce this.*

---

## 0. TL;DR

You have **two repositories** and **three generations** of the same CV site.

| | Repo folder | GitHub remote | What it is |
|---|---|---|---|
| **A** | `arseniykuzmin.github.io/` | `arseniykuzmin/arseniykuzmin.github.io` | The "public detached CV". **Live site = its `origin/master`.** Its local **`dev`** branch holds the newest work: a custom **Jinja2 static-site build** (`build.py`). |
| **B** | `cvpage/` | `queezz/queezz.github.io` | The dev/testing site. Its **`dev`** branch is the **abandoned Chirpy (Jekyll) trial** — the "junk" you remembered. Its `master` is a more-evolved version of the classic site. |

- The template you couldn't name = **Chirpy** (`jekyll-theme-chirpy`, by cotes2020). It lives only on `cvpage/dev` + the `chirpy` git remote. **Abandoned.**
- The direction worth keeping = the **Jinja2 `build.py` generator on `arseniykuzmin.github.io/dev`** (commits "PASS 1–5", 2026-03-28). This *is* the "centralized, cleaned machinery" you asked for — it already exists, ~80% done, and is not yet wired to deploy.
- **Nothing new is live.** The public site is still Generation 1 (runtime-JS). Both refactors are unshipped.

---

## 1. The two repositories

Both folders sit in `Dropbox/JobHunting/` (yes, both under Dropbox). Neither has a `.gitignore`.

### A. `arseniykuzmin.github.io/`  → `github.com/arseniykuzmin/arseniykuzmin.github.io`
Branches:
- `origin/master` @ `fe03c2e` (2025-11-13, "upd(conferences)") — **this is what's deployed** via classic GitHub Pages (served from repo root; no Action, no `docs/`, no `CNAME`).
- `master` (local) @ `14b9eac` (2026-03-28, "repo tree refactor") — **1 commit ahead of origin, not pushed.**
- `dev` @ `6fcc058` (2026-03-28, "PASS 5: full site render using build.py") — **HEAD; the Jinja2 refactor.**

### B. `cvpage/`  → `github.com/queezz/queezz.github.io`
- `master` @ `aa1fde4` (2026-03-22) — evolved classic site (runtime JS fetching JSON from `assets/data/`).
- `dev` @ `c7d965a` (2026-03-21) — **Chirpy trial (abandoned).**
- Extra remotes: `chirpy` = `cotes2020/chirpy-starter` (the theme upstream).
- **~20 `codex/*` remote branches** = AI-assisted experiments from 2025-08 (gallery/lightbox, vertical scroll-nav, scroll-to-top, CSS/JS streamlining, an mkdocs trial). Most were merged into `cvpage/master` via PRs #13–#21; a few (`streamline-css`, `streamline-js`, `mimic-readthedocs`) were not.

> ⚠️ **Domain identity confusion.** Repo A publishes to `arseniykuzmin.github.io`, but its `<meta og:url>`/`og:image` point to `https://queezz.github.io/...`. Repo B *is* `queezz.github.io`. Decide which URL is the real public one before shipping (see Findings §5).

---

## 2. Timeline (reconstructed from commits)

| Date | Repo/branch | Event |
|---|---|---|
| 2023-05 → 2023-12 | A/master | Site born: hand-built multi-page HTML (about, conferences, publications, projects). |
| 2025-08 | A/master | Visuals overhaul: dark mode, mobile fixes, scholar/github links, projects refactor. |
| 2025-08 | B (codex/*) | Burst of AI experiments (gallery lightbox, scroll-nav, scroll-to-top…), merged to B/master. |
| 2025-10 | B/master | `SITE_ROOT`/baseurl-aware asset fetches. |
| 2025-11 | A/master | Last live update ("upd(conferences)"). **← current public site.** |
| 2025-12 → 2026-03-21 | B/dev | **Chirpy trial**: test tabs, blog, "switching site template". Abandoned. |
| 2026-03-22 | B/master | "upd projects file structure refactor". |
| 2026-03-28 | A/master → A/dev | "repo tree refactor", then **PASS 1–5: Jinja2 `build.py`** generator. |

Note the workflow **flipped**: historically B (cvpage) led and A followed. The latest and best machinery was built directly in **A/dev**, so A is now *ahead* of B.

---

## 3. The three generations

### Gen 1 — Classic multi-page + runtime JS  *(LIVE; A/origin/master, B/master)*
- One `.html` per section. Content increasingly extracted to JSON and injected **at runtime** by `scripts/*.js` (`about.js`, `publications.js`, `conferences.js`, `projects.js`).
- Navbar injected by `navbar.js`; dark mode via `localStorage` + `.dark-mode` class + an inline anti-FOUC bootstrap script duplicated in every page `<head>`.
- Pros: simple to host. Cons: content invisible without JS (bad for SEO/crawlers/print), scattered CSS hacks, per-page duplication.

### Gen 2 — Jekyll + Chirpy  *(ABANDONED; B/dev only)*
- Full Chirpy scaffold: `_config.yml`, `_tabs/`, `_includes/`, `_layouts/`, `_posts/` (a blog), `Gemfile`(+lock), `.github/workflows/pages-deploy.yml` (Jekyll build + htmlproofer).
- Projects reorganized into **numbered** folders (`assets/projects/01-…/`). Committed the generated `_site/` output (heavy).
- Your own `README.md` on B/dev documents it and says *"master is the older static layout; dev migrates content into Chirpy."* You decided against it — likely too heavy/opinionated for a one-page CV, and a Ruby toolchain on Windows.

### Gen 3 — Custom Jinja2 generator  *(CURRENT DIRECTION; A/dev)* ⭐
- **`build.py`** (298 lines): `data/*.json` + `projects/<slug>/index.md` (YAML front-matter + Markdown) → renders **`dist/`** via Jinja2 + `python-markdown` + BeautifulSoup.
- Deps in `requirements.txt`: `Jinja2, PyYAML, markdown, beautifulsoup4`. **No venv exists for these repos yet.**
- **Pre-renders content** into static HTML (`dist/index.html` has education/skills/experience baked in — the "removing JS dependency" goal, PASS 4). Keeps *small* runtime JS for genuine interactivity only (dark-mode toggle, publication sorting, collapsibles, responsive tweaks).
- Reads `image-sizes.json` to emit `width`/`height` + `loading="lazy"`/`decoding="async"` (prevents layout shift — good perf hygiene already present).
- Ports JS logic to Python (e.g. `transform_authors()` mirrors `publications.js`).
- Templates: `templates/base_build.html` (clean), `base.html` (annotated reference), `pages/*`, `partials/*` (navbar + inlined runtime JS snippets), `macros.html`.

---

## 4. Metadata to keep safe (source-of-truth inventory)

The canonical content now lives as **structured data**, freshest copy in **`A/dev`**:

| Asset | Path (in A/dev) | Notes |
|---|---|---|
| Bio / education / skills / experience | `data/about.json` (148 ln) | drives the About page |
| Publications | `data/publications.json` (766 ln) | |
| Conferences | `data/conferences.json` (237 ln) | |
| Project index | `data/projects.json` (107 ln) | slug/title/imageUrl per project |
| BibTeX source | `data/mypapers.bib` (678 ln) | **identical across all repos/branches — stable** |
| Image dimensions | `data/image-sizes.json` (122 ln) | generated (perf) |
| Per-project detail | `projects/<slug>/index.md` + local images | YAML front matter: `hero`, `gallery`, `layout` |
| Photos/figures | `img/`, `kaa.png/jpg`, `projects/*/*` | see §5 perf |
| SEO/OG + favicon | page `<head>` meta, `favicon.ico`, `.nojekyll` | og:url/og:image need fixing (§5) |
| Data pipeline | `scripts/bib2json.py` | `.bib` → publications JSON |

> **Duplication/drift risk:** the same JSON exists in `A/dev:data/`, `B/master:assets/data/`, and `B/dev:_site/assets/data/`. They have **drifted** (md5 differs) — only `mypapers.bib` is still in sync. Before cleanup, pick **one** source of truth (recommend `A/dev:data/`) and treat the others as stale copies.

---

## 5. Findings relevant to cleanup (Steps 2 & 3)

**Structural**
1. **Deploy gap (biggest blocker).** `build.py` writes to `dist/`, but Pages serves the repo **root** (no Action/`docs/`/`CNAME`). The new site is currently orphaned. Must choose one: (a) render to root, (b) render to `docs/` + set Pages source, or (c) a GitHub Action that builds and publishes `dist/`.
2. **Gen-1 and Gen-3 coexist on `A/dev`.** Legacy root `*.html` (runtime-JS) still sit beside `dist/`. Two sources of truth. Once deploy is decided, retire the Gen-1 root pages + the now-unneeded runtime scripts.
3. **Data drift across repos** (see §4). Consolidate to one.

**Metadata**
4. **`og:url`/`og:image` point to `queezz.github.io`** inside the `arseniykuzmin.github.io` repo. Pick the canonical public domain and make meta consistent everywhere.

**Performance**
5. **~13.9 MB of raster images (29 files).** Heavy offenders: `XraySimulationResult.png` 2.05 MB, `ControlUnit.png` 1.76 MB, `bioshake.png` 1.50 MB, `m6_nozzle_holder.jpg` 1.21 MB, `kaa.png` 1.11 MB, `ToreSupra.png` 0.98 MB. These are photos/screenshots saved as PNG. Biggest win: resize to display size + convert to WebP/AVIF + `srcset`. The build already emits dimensions + lazy-load, so the plumbing is ready.
6. **Duplicated image files:** e.g. `ToreSupra.png` and `vup2-metal.jpg` exist in both `img/` and `projects/<slug>/`. Dedupe.

**CSS / "hacks"**
7. **9 stylesheets, fragmented:** `styles.css`(418), `about.css`(240), `project.css`(143), `citations.css`(100), `sortbuttons.css`(84), `scrollnav.css`(61), `projects.css`(45), `sidemenu.css`(25), `conferences.css`(**2 — near-empty stub**). Only **1 `!important`** remains, so it's cleaner than you may remember — the job is *consolidation/pruning*, not de-hacking. Consider CSS variables for the color/dark-mode palette.
8. **Layout-via-JS hacks** to move into CSS: `index.html` runs a `resize` handler (`moveProfileIfNeeded`) that physically relocates the `#profile` node between containers at 768px — replaceable with flex/grid ordering. Also inline `style="margin-left:auto"` in the navbar, and the anti-FOUC dark-mode script duplicated in every page head (centralize).

**Dead weight (verify, then remove)**
9. `backup.html` (201 ln) in both repos — stale snapshot.
10. `sidemenu.html` / `sidemenu.js` / `sidemenu.css` and `project.html` / `project_detail_ui.js` — legacy runtime project-detail machinery, superseded by `build.py`'s `project_detail` rendering. Confirm no template references them, then retire.

---

## 6. Suggested path (high level — no code yet)

1. **Adopt `A/dev` (Gen-3 Jinja2) as the base.** Explicitly drop Chirpy (`B/dev`).
2. **Decide the deploy model** (root vs `docs/` vs Action) and the **canonical domain** (arseniykuzmin vs queezz). Everything else depends on these two answers.
3. **Consolidate content to one source of truth** (`A/dev:data/` + `projects/*/index.md`); archive the drifted copies.
4. **Finish the cutover:** wire `dist/` to Pages, then delete Gen-1 root pages + dead files (§9–10).
5. **Perf pass:** image resize/WebP + `srcset` (biggest measurable win).
6. **CSS pass:** merge/prune the 9 stylesheets, hoist palette to CSS variables, replace the profile-move JS with CSS.
7. **Reconcile the two repos** (or consciously keep them as public-vs-staging with a defined promote step).

## 7. Open questions for you
- Which is the **real public URL** — `arseniykuzmin.github.io` or `queezz.github.io`? Are both meant to stay live, or is one retired?
- Deploy preference: render straight to **root**, to **`docs/`**, or build via **GitHub Action**?
- Keep the two-repo (public + staging) split, or collapse to one?
- Was the **`build.py`/PASS 1–5** work done by you, or an assistant? (Affects how much to trust/verify it before building on it.)
