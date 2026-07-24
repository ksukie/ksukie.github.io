# Resume requirements summary

## Confirmed target

- Build directly inside `Profile-latex-ksq`.
- Use the `Tairan He` LaTeX project as the visual and engineering baseline.
- Preserve the same A4 single-column layout, fonts for Latin text, red/charcoal
  headings, rules, header, footer, entry system, and spacing vocabulary.
- Change only content-specific behavior needed for 柯书奇's information.
- Use English throughout the visible resume to match the Tairan reference; the
  supplied `zh-CN` source remains the factual authority.
- Use no portrait because the user requested the same format as Tairan's no-photo CV.
- Target: Computer Vision / Edge AI / Robot Learning.
- Target length: two pages where readable; do not force a one-page layout.

## Source and traceability

- Authoritative source: `C:/Users/asus/Desktop/ksukie.github.io/resumesoft.html`.
- User confirmation: the supplied HTML contains the user's own information.
- Missing portfolio URL is omitted rather than inferred from the repository name.
- Publication venues, author lists, dates, DOI links, and metrics not present in
  the source are not invented.

## Template decision

- Selected template family: user-mandated project-local Tairan-derived CV style.
- `CV_SKILL_ROOT`: `C:/Users/asus/.codex/skills/resume-crafter`.
- The user explicitly requires the existing Tairan project structure, so the
  bundled `common/resume.cls` template is not used.
- Working source paths: `src/main.tex`, `src/cv-style.sty`, `src/cv-data.tex`,
  and `src/sections/*.tex`.
- Final PDF path: `output/pdf/ksq-cv.pdf`.

## Editorial choices

- Keep the internship, lab experience, all three research outputs, and all eight
  source-backed projects, including the new IsaacSim-Tactile4OpenWorld entry.
- Synchronize renamed and revised repositories: OpenFireAlert, TactileFlowField,
  and EdgeVisTrack-RKNN. Retain the two broader engineering projects compactly.
- Convert long web paragraphs into concise bullets without adding metrics or claims.

## Blocking gaps

- None. The source and user instruction resolve identity, language, contact,
  target, photo choice, chronology, and content scope sufficiently for drafting.

## Omission audit

- Portfolio URL: omitted because no URL appears in the supplied source; impact is
  limited to showing email, phone, and GitHub in the header.
- No source-backed project is omitted from the final two-page version.
