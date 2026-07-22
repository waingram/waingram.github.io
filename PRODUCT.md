# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site serves collaborators, funders, students, reviewers, academic peers, library technology leaders, and other visitors evaluating William A. Ingram's scholarly expertise, leadership record, publications, projects, and contact pathways.

## Product Purpose

This is a personal academic and leadership portfolio. It establishes credible expertise at the intersection of digital libraries, scholarly communication, AI, machine learning, and machine-usable scientific knowledge; helps visitors quickly understand the research program; and provides reliable routes to publications, professional history, research outputs, and external scholarly profiles.

## Positioning

Ingram operates the infrastructure he researches. The claim a peer's academic homepage could not truthfully copy is the verifiable combination of senior library-IT leadership — Associate Professor at Virginia Tech, Associate Dean and Executive Director for IT of the University Libraries, and Director of the Center for Digital Research and Scholarship — with an active computer-science research program (Ph.D., Virginia Tech, 2026) on making scholarly knowledge machine-usable. Leadership record and research record substantiate each other; the site presents them as one program, not two careers.

## Operating Context

Four evaluation scenarios are confirmed primary, all first-class:

- **Funders and program officers** verifying PI credibility, grant history, and the publication record during proposal review.
- **Prospective graduate students** scouting an advisor: understanding the research program and mentorship record before reaching out.
- **Peers and collaborators** — academic peers and library-technology leaders doing pre-meeting, pre-review, and invited-talk lookups.
- **Committees and institutions** — promotion/tenure, hiring, and leadership-search committees verifying the professional record.

Visitors verify claims against the canonical external profiles the site links: ORCID (0000-0002-8307-8844), Google Scholar, DBLP, Scopus, Virginia Tech Experts, GitHub, and LinkedIn. Publications are maintained as BibTeX and rendered site-side in ACM citation style; news is a dated, hand-maintained feed. The site deploys to GitHub Pages via a GitHub Actions workflow.

## Capabilities and Constraints

- Jekyll static site, no server runtime; the GitHub Actions build enables plugins outside the default GitHub Pages set (jekyll-scholar). Publications render from `_data/publications/*.bib` (8 category files) with per-entry BibTeX detail pages.
- **Binding: human/machine parity.** Every substantive page keeps its machine-readable twin in sync — JSON twins (`/research.json`, `/grants.json`, `/projects.json`, `/publications.json`), `knowledge-graph.jsonld`, FOAF (`foaf.rdf`, `foaf.ttl`), and schema.org microdata/h-card in markup. New or changed surfaces ship with their structured-data counterparts.
- Bibliographic data and citation templates are canonical scholarly records; do not modify BibTeX records or citation rendering without explicit owner approval.
- Roles, titles, degrees, grants, and publication facts are verifiable claims; present them exactly as recorded, without embellishment.
- Terminology: ETDs (electronic theses and dissertations), scholarly big data, machine-usable knowledge, CDRS (Center for Digital Research and Scholarship).

## Brand Commitments

- Name forms: "William A. Ingram" (formal), "Bill Ingram" (familiar), honorific suffix Ph.D.; canonical identity URI `https://waingram.github.io/#waingram`.
- Voice and personality: scholarly, expertise-driven, and trustworthy. The voice should feel precise, grounded, and intellectually serious, with enough warmth to make collaboration approachable.
- Assets: headshot at `img/wai.png`; favicon and touch-icon set at the repo root.

## Anti-references

Avoid generic Bootstrap/CV blandness, flashy startup-style AI branding, novelty effects that distract from scholarly substance, and portfolio styling that treats academic credibility as decoration rather than evidence.

## Evidence on Hand

- 49 publications across 8 BibTeX categories in `_data/publications/` (conferences 12, extended abstracts 13, workshops 7, journals 5, reports 5, tutorials 3, hosted workshops 3, chapters 1).
- Grant records with identifiers in `_pages/grants.json` — e.g., IMLS National Leadership Grant LG-256638-OLS-24, "Harnessing ETDs: Pioneering AI-Driven Innovations in Library Service" (PI, 2024).
- Dated news feed in `_data/news.yml` (maintained through June 2026), including Ph.D. completion (dissertation in VTechWorks, hdl.handle.net/10919/143528) and student paper acceptances naming mentees with linked profiles.
- Blog: 3 posts in `_posts/` (2024–2025).
- Machine-readable identity: `_pages/knowledge-graph.jsonld`, the JSON page twins, `foaf.rdf`/`foaf.ttl`, and schema.org microdata throughout the markup.
- Absences future work must not fabricate: no testimonials, press quotes, case studies, or citation metrics (h-index, citation counts) exist in site data; no downloadable CV PDF — the Experience page is the professional-history surface.

## Product Principles

- Lead with earned authority: make research themes, roles, grants, publications, and scholarly identifiers easy to scan and verify.
- Make complex work legible: structure dense academic content so the visitor can understand the research program without flattening its nuance.
- Preserve trust through restraint: use visual distinction to clarify hierarchy and credibility, not to chase trendiness.
- Connect human and machine readability: support both visible visitor comprehension and the site's structured-data goals.
- Keep collaboration visible: make contact, affiliations, and scholarly networks feel close at hand.

## Accessibility & Inclusion

Aim for WCAG AA readability and interaction quality. Maintain strong text contrast, keyboard-friendly navigation, clear focus states, semantic structure, reduced-motion respect, and layouts that remain comfortable for long-form reading across viewport sizes.
