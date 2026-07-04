# Agent Landing

Start here when an AI agent opens this repo.

## First reads

1. [`.agents/README.md`](.agents/README.md) - map of the agent notes.
2. [`.agents/directions.md`](.agents/directions.md) - current state, decisions,
   and next work.
3. [`.agents/commit-culture.md`](.agents/commit-culture.md) - commit rules,
   staging rules, and verification expectations.
4. [`.agents/CHANGELOG.md`](.agents/CHANGELOG.md) - completed milestones.

Use [`.agents/log/`](.agents/log/) when you need dated session detail. Use
[`README.md`](README.md) for human-facing build and serve commands.

## Landing Spots

| Need | Put it here |
|------|-------------|
| Open decisions, current status, next work | [`.agents/directions.md`](.agents/directions.md) |
| Completed milestones | [`.agents/CHANGELOG.md`](.agents/CHANGELOG.md) |
| Detailed session handoff | [`.agents/log/YYYY-MM-DD-short-title.md`](.agents/log/) |
| Commit rules and verification gates | [`.agents/commit-culture.md`](.agents/commit-culture.md) |
| Long background/history | [`.agents/CV_SITE_ARCHAEOLOGY_2026-07-02.md`](.agents/CV_SITE_ARCHAEOLOGY_2026-07-02.md) |

When work ships, remove it from `directions.md` and record it in
`CHANGELOG.md`. Do not leave long "DONE" sections in directions.

## Repo Rules

- Source of truth: this repo.
- Work branch: `dev`, unless directions say otherwise.
- Generated output: `dist/` is ignored and rebuilt.
- Build command: `cvsite build`.
- Preview command: `cvsite serve`.
- Do not push unless the user explicitly asks.
- Do not leak machine-specific full paths or usernames into docs.
