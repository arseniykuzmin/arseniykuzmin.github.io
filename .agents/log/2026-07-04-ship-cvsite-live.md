# Ship cvsite live

**Date:** 2026-07-04
**Goal:** take the finished `cvsite` Python build live on
`arseniykuzmin.github.io` as fast as safely possible.

## Decisions
- Treat "make it live" as the next direction: ship the already-verified `dev`
  work rather than starting a new feature first.
- Ship docs and code together in a single deploy: record the shipment in the
  agent notes on `dev`, then merge to `master` once, so the Pages Action runs
  only once.
- Merge as a fast-forward because `dev` was 8 ahead / 0 behind `master`, keeping
  history linear.

## Changed
- `.agents/directions.md`: TL;DR now says the build is shipped/live; "Current
  state" notes `master` deploys via the Action; removed the completed "Review
  and ship" item and renumbered the remaining next-work items; dropped the
  decided "merge/push" open question.
- `.agents/CHANGELOG.md`: added a 2026-07-04 "Shipped the cvsite build to
  production" entry.
- Added this handoff log.

## State
- `cvsite build` passed (exit 0). Output: 4 top-level pages
  (`index`, `projects`, `publications`, `conferences`), 15 project detail pages,
  `.nojekyll` present, `<base href="/">` set.
- Working tree clean; `dist/` stays ignored.
- Merged `dev` -> `master` (fast-forward) and pushed `master` to `origin`.
- The "Deploy GitHub Pages" Action runs on push to `master` and publishes
  `dist/`.

## Next
- Confirm the Pages deploy finished green and spot-check the live site.
- Phase 2: mirror `dist/` to `queezz.github.io` (needs a cross-repo deploy
  token the user must provide).
- Then the navigation/rails and performance passes in `directions.md`.
