# 2026-07-04 Publication Cards and About Tightening

## Goal
Ship the queued Publications/Conferences card redesign, add Publications live
filtering, retire shifting list numbers, expose the BibTeX file, and tighten
the About page layout.

## Decisions
- Kept venue-badge enrichment in the build layer so server-rendered HTML and
  client-side filter rerenders use the same codes and stable badge colors.
- Copied `data/mypapers.bib` into `dist/data/mypapers.bib` instead of copying
  all source data files.
- Left the mirror deploy work queued because it still needs a user-provided
  cross-repo token/secret.
- Deferred the broader image performance pass; the card/About work was already
  a cohesive UI change.

## Changed
- `src/cvsite/builder.py`
- `templates/macros.html`
- `templates/pages/publications.html`
- `templates/pages/conferences.html`
- `templates/partials/publications_runtime.js`
- `templates/partials/conferences_runtime.js`
- `templates/partials/about_runtime.js`
- `styles/citations.css`
- `styles/about.css`
- `.agents/directions.md`
- `.agents/CHANGELOG.md`

## State
- `cvsite build` equivalent verified through the project virtualenv:
  `python -m cvsite build`.
- Browser checked generated pages:
  - Publications: 46 cards, BibTeX link present, no `[N]` numbering, no
    horizontal overflow.
  - Publications filter: `QUEST` reduces the list to 22 cards.
  - Conferences: 21 cards, newest PSI-27 badge, no numbering, no horizontal
    overflow.
  - Conferences filter: `LHD` reduces the list to 6 cards.
  - About desktop: Education, Skills, and Experience render as two columns.
  - About mobile: About grids collapse to one column with no horizontal
    overflow.

## Next
- Mirror deploy to `queezz.github.io` once the token/secret exists.
- Continue the image performance pass: resize/compress, consider WebP/AVIF and
  `srcset`, and dedupe repeated images.
