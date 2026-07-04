# venv + branch cleanup

**Date:** 2026-07-02
**Goal:** Stand up a dedicated build venv for the Python-curated site, and tidy
the branch clutter (keeping Chirpy as the blog seed).

## Decisions
- **Dedicated venv `~/.venvs/cvsite`** (python.org 3.14.5) for the site build —
  matches the per-project `~/.venvs` convention. NB: `~/.venvs/cvforge` is a
  *different* thing (LaTeX/docx CV-**document** toolkit), not the website.
- **Chirpy kept as a future blog:** cvpage `dev` renamed to `blog-chirpy`
  (local + remote); the `chirpy` remote is untouched.
- **All `codex/*` experiment branches removed** from the cvpage remote (merged
  ones + the 2 superseded unmerged ones).

## Changed
- venv `~/.venvs/cvsite`: installed `Jinja2, PyYAML, markdown, beautifulsoup4`
  (from `arseniykuzmin.github.io/requirements.txt`); imports verified.
- Ran `build.py` → **zero diff** vs the committed `dist/` (the site is
  reproducible from source with this venv).
- cvpage remote: removed 22 `codex/*` / `n6mlzh` branches (most were already
  gone server-side from auto-delete-on-merge — stale local refs pruned; one
  real leftover, `mimic-readthedocs`, deleted). Renamed `dev` → `blog-chirpy`.

## State
- Build command: `~/.venvs/cvsite/Scripts/python arseniykuzmin.github.io/build.py`
- cvpage branches: local `master` + `blog-chirpy`; origin `master` +
  `blog-chirpy`; `chirpy/main` kept. Clean.
- Nothing pushed to `master` (site unchanged) — the branch ops were remote
  admin only. Local `master` is ahead of origin by the two `.agents` commits.

## Next
- Local **file-tree** cleanup. Deploy-dependent parts still need the canonical
  domain + deploy-model decisions. Deploy-independent wins available now: drop
  `backup.html`, dedupe images, retire dead `sidemenu.*` / `project.html`
  machinery. See `CV_SITE_ARCHAEOLOGY_2026-07-02.md` §5, §9–10.
