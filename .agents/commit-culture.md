# Commit Culture

Conventions for commits on this CV site repo.

## Authorship

- Never add an AI as a git co-author. No `Co-Authored-By` trailer.
- End agent-written commits with a single `agent:` line:

  ```text
  agent: gpt-5 codex
  ```

  Human-authored commits omit the line.

## Commit messages

- Short title, around 50 characters, no trailing period.
- Body wrapped at a readable width. State the why and the behavioral surface,
  not every file-level detail.
- Put `agent:` last.

## Branching and pushing

- Work on `dev` unless directions say otherwise.
- When the site is good locally, merge `dev` to `master`; the GitHub Pages
  Action deploys from `master`.
- Do not push unless the user explicitly asks.

## What to stage

- Add paths deliberately; do not `git add -A` blindly.
- Do not stage unrelated local edits, especially `cv.code-workspace`.
- Keep `.agents/` as markdown notes and handoffs. No build artifacts or local
  screenshots unless a handoff explicitly needs one.
