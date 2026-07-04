# .agents/

Working logs and handoffs for AI-assisted sessions on the **CV site**.

This is operational scratch space for the source CV repo:

- `arseniykuzmin.github.io/` -> `github.com/arseniykuzmin/arseniykuzmin.github.io`

The sibling `cvpage/` repo still has historical notes, but this repo is now the
primary home for active CV-site directions and handoffs.

If an agent starts from the repo root, [`../AGENTS.md`](../AGENTS.md) is the
landing page. This directory is the working cockpit.

## Layout

- [`../AGENTS.md`](../AGENTS.md) - root landing page for agents.
- [`directions.md`](directions.md) - start here: current status and the
  forward-looking plan.
- [`CHANGELOG.md`](CHANGELOG.md) - compact ledger of completed work.
- [`CV_SITE_ARCHAEOLOGY_2026-07-02.md`](CV_SITE_ARCHAEOLOGY_2026-07-02.md) -
  background dig into the old repos/generations and cleanup findings.
- [`log/`](log/) - dated session handoffs (`YYYY-MM-DD-*.md`).
- [`handoff-template.md`](handoff-template.md) - copy-paste handoff skeleton.
- [`commit-culture.md`](commit-culture.md) - commit message style and the
  required `agent:` line.

## Naming convention

One file per session/handoff, in [`log/`](log/), named:

```text
YYYY-MM-DD-short-title-kebab.md
```

If two handoffs land on the same day, append a counter:
`2026-07-04-project-ui-polish-2.md`.

## What goes in a handoff

Keep it short and skimmable:

- **Goal** - what this session set out to do.
- **Decisions** - choices made and why.
- **Changed** - files/commands added or modified.
- **State** - what works now and what was verified.
- **Next** - the obvious next step(s).

See [`handoff-template.md`](handoff-template.md).

## Changelog vs directions

- Put completed milestones in [`CHANGELOG.md`](CHANGELOG.md).
- Keep [`directions.md`](directions.md) focused on current state, decisions,
  and next work.
- Use [`log/`](log/) for detailed session handoffs.
- When an item ships, delete it from directions rather than leaving a long
  completed section there.
