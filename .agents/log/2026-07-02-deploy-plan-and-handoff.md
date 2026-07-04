# Deploy plan + session handoff

**Date:** 2026-07-02
**Goal:** Decide the deploy model and hand off cleanly (user going away).

## Decisions
- CV **live at both URLs**; **deploy via GitHub Action** (build on push).
- Source of truth **assumed** = `arseniykuzmin.github.io`; work on `dev`, merge
  to `master`, deploy from `master`. (Confirm with user next session.)

## Changed
- Added [`directions.md`](../directions.md) — the forward-looking resume map
  (status, confirmed decisions, Phase 1/2/3 plan, the build.py "self-contained
  dist" catch, open questions). Listed it as **start here** in the README.
- No site/code changes this session beyond notes; **Phase 1 not started**.

## State
- Both repos clean (see `directions.md` → "Current state"). `arseniykuzmin`/dev
  untouched; committed `dist/` reproduces zero-diff. `cvpage/master` is ahead of
  origin by 2 (notes, unpushed).
- Build: `~/.venvs/cvsite/Scripts/python arseniykuzmin.github.io/build.py`.

## Next
- Start **Phase 1** (see `directions.md`): self-contained `dist/` in `build.py`,
  add the Pages Action, untrack `dist/`, retire the Gen-1 pages, fix meta,
  rebuild + preview. All local + previewed before any push.
