# Commit & Versioning Culture

Standing conventions for this CV site repo. This is not a dated handoff; these
rules hold until changed here.

## Authorship

- **Never add an AI as a git co-author.** No `Co-Authored-By` trailer.
- End agent-written commits with a single line naming the agent:

  ```text
  agent: gpt-5 codex
  ```

  Update the model name if a different agent writes the commit. Human-authored
  commits omit the line.

## Commit messages

- **Short title** around 50 characters, no trailing period. State the change,
  not the diff.
- **Controlled-width body** at a readable width. One or two sentences of
  context, then bullets when they help scanning.
- State the why and the behavioral surface, not every file-level detail.
- Optional trailing note for deferred work: `Next: ...`.
- Put `agent:` last, after a blank line.

Example:

```text
Normalize agent notes

Move completed work out of directions and into the agent changelog so
directions stays focused on current state and next work.

- Add a root agent landing page.
- Clarify where logs, shipped milestones, and open decisions belong.

agent: gpt-5 codex
```

## Branching and pushing

- Work on `dev` unless directions say otherwise.
- When the site is good locally, merge `dev` to `master`; the GitHub Pages
  Action deploys from `master`.
- **Do not confuse pushed with deployed.** A push to `dev` is only a remote
  backup/review branch; it will not change `arseniykuzmin.github.io`. If the
  user expects to see the change live, fast-forward `master` to `dev` and push
  `master`, then say that the Pages Action still needs a short time to deploy.
- Do not push unless the user explicitly asks.
- Do not create tags unless the user explicitly asks.

## What to stage

- Add paths deliberately; do not `git add -A` blindly.
- Do not stage unrelated local edits, especially `cv.code-workspace`.
- Keep `.agents/` as markdown notes and handoffs. No build artifacts or local
  screenshots unless a handoff explicitly needs one.
- Do commit repo instructions that future agents need, including `AGENTS.md`,
  `.agents/README.md`, `.agents/directions.md`, `.agents/CHANGELOG.md`, and
  dated handoffs.
- Do not put machine-specific full paths or usernames into docs. Prefer
  repo-relative paths and commands using `$env:USERPROFILE` when a user-local
  path is unavoidable.
- LF to CRLF warnings on Windows are expected and harmless.

## Pre-commit gates

Before a commit, run the smallest verification that matches the change:

- Docs/agent-note-only changes: inspect the staged diff.
- Build or template changes: run `cvsite build`.
- Site behavior/layout changes: run `cvsite build`, then preview with
  `cvsite serve` and capture browser screenshots for affected desktop/mobile
  surfaces when practical.
- Deployment workflow changes: inspect the workflow diff and confirm the build
  command still matches the package entry point.

If a relevant gate cannot be run, say so in the final report.

## Granularity

- One cohesive change per commit.
- Split unrelated feature sets into separate commits.
- For meaningful chunks, update `.agents/CHANGELOG.md` or add a dated handoff in
  `.agents/log/`.
