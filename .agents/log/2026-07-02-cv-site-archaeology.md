# CV site archaeology + `.agents` scratch repo

**Date:** 2026-07-02
**Goal:** Dig through the CV-site repos (no code changes), write up what exists,
then stand up this private `.agents/` scratch repo to hold the notes.

## Decisions
- **Keeper direction = the Jinja2 `build.py` generator** on
  `arseniykuzmin.github.io/dev` (commits "PASS 1–5"). The Jekyll **Chirpy**
  trial on `cvpage/dev` is **abandoned**.
- **`.agents/` is an independent git repo** nested in `cvpage`, with a private
  GitHub origin, and **git-ignored by `cvpage`** — so private notes survive
  Dropbox sync but never reach the public site. Mirrors the paperlib pattern.
- Archaeology kept as a **standing reference doc** at the repo top level, not a
  log entry (it's background, not a per-session handoff).

## Changed
- `.agents/CV_SITE_ARCHAEOLOGY_2026-07-02.md` — moved here from the `cvpage`
  root (the full dig / findings).
- `.agents/README.md`, `handoff-template.md`, `commit-culture.md` — conventions,
  adapted from the paperlib `.agents/`.
- `cvpage/.gitignore` — new; ignores `.agents/` (left uncommitted in `cvpage`
  pending the user's go-ahead to commit it there).

## State
- Read-only dig complete; **no site files modified** in either repo.
- Live public site is still Generation 1 (runtime-JS); both refactors unshipped.
- `.agents/` initialized as its own `main` repo and committed. Private GitHub
  origin **not yet created** — `gh` isn't installed, and the user opted to stay
  local-only for now (name reserved: `queezz/cv-agents`).

## Next
- **Superseded (same day):** we folded `.agents` into the `cvpage` repo instead
  of a separate `queezz/cv-agents` origin — the site is public, so one repo is
  less upkeep. See `2026-07-02-fold-agents-into-cvpage.md`; the remote steps
  below no longer apply.
- **Remote (deferred — user chose local-only for now).** Repo name decided:
  `queezz/cv-agents` (create it **private** and empty — no README/license).
  Then, from inside `.agents/`:

  ```bash
  git remote add origin https://github.com/queezz/cv-agents.git
  git push -u origin main
  ```
- Decide the four unblockers before any cleanup: canonical public URL
  (arseniykuzmin vs queezz), deploy model (root / `docs/` / Action), one repo
  vs two, and whether `build.py` (PASS 1–5) was human- or agent-authored.
- Then: wire `dist/` to Pages, retire Gen-1 root pages + dead files, image
  perf pass, CSS consolidation. See the archaeology doc §5–§7.
