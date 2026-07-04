# Fold .agents into the cvpage repo

**Date:** 2026-07-02
**Goal:** Undo the separate-repo setup — track the `.agents` notes inside
`cvpage` instead of an independent git repo with its own origin.

## Decisions
- **One repo, not two.** The CV site is public and always has been, so the dev
  history isn't sensitive; a second independent repo (its own origin, its own
  push) is more upkeep than it's worth. Track `.agents/` in `cvpage`.
- Chirpy stays parked for a future **blog** (not the CV) — unaffected by this.

## Changed
- Removed the nested `.git` from `.agents/` (backed up to the session scratchpad
  first) and the `cvpage/.gitignore` that had hidden it.
- `.agents/` committed into `cvpage` (see that repo's history).
- `README.md` + `commit-culture.md` — dropped the "independent / private /
  git-ignored" framing.

## State
- `.agents/` is now normal tracked content in `cvpage` (branch `master`),
  committed locally. **Not pushed** — pushing `cvpage` updates the live
  `queezz.github.io` site, so that's the user's call.
- No site files changed.

## Next
- CV cleanup still waits on two decisions: canonical domain (arseniykuzmin vs
  queezz) and deploy model (root / `docs/` / Action). See
  `CV_SITE_ARCHAEOLOGY_2026-07-02.md` §6–§7.
