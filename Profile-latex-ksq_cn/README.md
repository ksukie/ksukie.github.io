# Ksq Chinese LaTeX CV

This project keeps the existing Chinese CV design while following the source,
section, build, and output layout of Profile-latex-ksq.

## Structure

- src/cv-data.tex: personal details, links, avatar path, and document date.
- src/cv-style.sty: shared Chinese CV visual style and header/footer commands.
- src/sections/: education, research, skills, projects, internship, and publications.
- src/assets/: local image assets used by the CV.
- input/template-readme.txt: the original template attribution notes.
- build/: generated XeLaTeX artifacts.
- output/pdf/ksq-cv-cn.pdf: final PDF.
- work/: reserved for working notes and review artifacts.

## Build

Run from the project root with PowerShell:

    .\build.ps1
