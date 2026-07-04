# Src package and static assets

**Date:** 2026-07-04
**Goal:** turn the site builder into a small Python package and move loose root
assets into a static asset directory.

## Decisions
- Keep the site as a static generator, not a web framework.
- Use `src/cvsite/` for build and serve logic.
- Keep `build.py` as a compatibility wrapper.
- Move loose root assets (`favicon.ico`, `kaa.jpg`, `kaa.png`) to `static/`.
  Keep `.nojekyll` at repo root because it is deployment metadata, not media.

## Changed
- Added `pyproject.toml` with package metadata, dependencies, and a
  `cvsite = cvsite.cli:main` console script.
- Added `src/cvsite/builder.py`, `src/cvsite/cli.py`, `src/cvsite/__init__.py`,
  and `src/cvsite/__main__.py`.
- Replaced root `build.py` with a thin wrapper that imports `cvsite.builder`.
- Updated `requirements.txt` to `-e .`.
- Updated Pages workflow to run `cvsite build`.
- Updated templates to use `static/favicon.ico`, `static/kaa.jpg`, and
  `static/kaa.png`.
- Updated `data/image-sizes.json` for the moved profile image.
- Updated README to prefer `cvsite build` and `cvsite serve`.

## State
- `cvsite` installed editable into `$env:USERPROFILE\.venvs\cvsite`.
- `cvsite build` passes.
- `cvsite serve --no-build --port 8777` served `projects.html` with HTTP 200.
- Generated href/src integrity check passed: 313 local references.
- Nothing has been pushed.

## Notes
- A parallel build test briefly failed because two builders raced on the same
  `dist/` directory. Sequential `cvsite build` is fine.
- On Windows, an active preview server can hold handles under `dist/`; stop the
  server before rebuilding manually. The normal `cvsite serve` path builds
  before starting the server.
