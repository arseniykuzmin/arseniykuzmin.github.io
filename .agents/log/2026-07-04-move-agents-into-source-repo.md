# Move agents into source repo

**Date:** 2026-07-04
**Goal:** make `arseniykuzmin.github.io` carry its own operational directions
and handoff logs before committing the cleanup work.

## Decisions
- Treat `arseniykuzmin.github.io/.agents` as the active home for CV-site agent
  notes going forward.
- Keep the sibling `cvpage/.agents` copy untouched for now; it is historical
  context and may still have unpushed notes.
- Keep commit culture local to this repo: work on `dev`, do not push unless the
  user asks, and use `agent: gpt-5 codex` for agent-written commits.

## Changed
- Copied `.agents/` from `cvpage` into `arseniykuzmin.github.io`.
- Updated `.agents/README.md` to describe this repo as the primary note home.
- Updated `.agents/commit-culture.md` for this repo's branch/deploy flow.
- Updated `.agents/directions.md` to reflect package/static-assets completion
  and the new `.agents` location.

## State
- Logs and directions are now present in the source repo and ready to commit
  with the site cleanup.
- Nothing has been pushed.

## Next
- Commit the `arseniykuzmin.github.io` cleanup on `dev`.
- Later, decide whether `cvpage/.agents` should be deleted, archived, or left as
  historical context.
