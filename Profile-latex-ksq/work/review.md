# Final resume review

## Source and factual review

- Authoritative source: `C:/Users/asus/Desktop/ksukie.github.io/resumesoft.html`,
  the local page the user identified as their own information.
- Identity, contact details, education, chronology, experience, research
  outputs, projects, and skills are traceable in `claim-source-map.md`.
- The missing portfolio URL is omitted. No venue, author list, date, DOI,
  metric, or outcome absent from the source was added.
- No unresolved placeholder remains in the compiled source.

## Build review

- Engine: XeLaTeX via `build.ps1`, two passes.
- Result: successful, two A4 pages.
- Output: `output/pdf/ksq-cv.pdf`.
- Fonts used by the PDF are embedded and have Unicode maps.
- Extracted PDF text contains the English name, contact details, all main
  English-language sections, eight projects, and the skills section.
- The visible LaTeX source and extracted PDF text contain no Chinese ideographs.
- The final build log contains no LaTeX warning, overfull/underfull box, missing
  character, undefined-reference, or compilation-error diagnostic.

## Visual review

- Page 1 follows the user-requested order: Employment, Education, Research
  Experience, Research Interests, and Publications.
- Research Interests remains a standalone section after Research Experience
  and before Publications. Page 2 presents Project Portfolio without a
  `Selected` note and ends with Skills.
- Publications use a consistent single-column academic layout: full title,
  metadata, and summary, numbered `[1]` through `[3]`. TY-YOLO shows a blue,
  non-clickable `[Under Review]` label. FgFEU-Net and Edge-Cloud Transportation
  Detection place a clickable `[Paper]` link directly after the full title and
  point to the matching official Springer chapter page.
- The July 23, 2026 source refresh adds IsaacSim-Tactile4OpenWorld and updates
  OpenFireAlert, TactileFlowField, EdgeVisTrack-RKNN, AdaptiveUI-SKILL, and
  AgentTools. Both rendered pages fit without clipping, overlap, orphaned
  headers, or cross-page splits.
- Per the user's explicit casing preference, role, degree, research-role,
  project, and research-output subtitles all preserve normal Title Case.
- Header, footer, English section treatment, red/charcoal rules, type hierarchy,
  and spacing remain consistent with the Tairan reference layout.
