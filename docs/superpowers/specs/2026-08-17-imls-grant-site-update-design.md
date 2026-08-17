# 2026 IMLS Grant Site Update Design

Date: 2026-08-17
Status: Approved from the user-provided scope

## Goal

Record William A. Ingram's two 2026 IMLS awards across the public website's news feed, research narrative, grant list, project list, and structured knowledge graph.
Add a concise blog post that explains how the two projects connect through the need for accurate and auditable AI in library work.

## Users and Stakeholders

- The primary user is William A. Ingram, who maintains the site as his public academic profile.
- Secondary users include collaborators, prospective students, funders, program officers, and library practitioners.
- Search engines and research agents consume the site's JSON and JSON-LD endpoints.

## Non-Goals

- This update does not claim results from projects that have not begun.
- This update does not infer final project periods, staffing allocations, or revised line-item budgets from the submitted proposals.
- This update does not publish the changes to GitHub Pages.

## Constraints

- The public IMLS award amounts of $473,403 and $178,994 are authoritative.
- William's role is Co-Principal Investigator on both projects.
- Human-readable and machine-readable site records must remain synchronized.
- Public prose must distinguish planned work from completed findings.

## Context

The site renders news from `_data/news.yml` and the human-readable research program from `_includes/research.html`.
It exposes parallel grant, project, researcher, and knowledge-graph records through files under `_pages/`.
The site uses Jekyll and validates the built output with the project eval scripts.

## Recommended Architecture

Add two dated news records and one blog post for the public narrative.
Add the grants and their related projects to the visible research page, `grants.json`, `projects.json`, `research.json`, and `knowledge-graph.jsonld`.
Use stable fragment identifiers based on the IMLS award numbers so the records link consistently across endpoints.

## Alternatives Considered

- A news-only update would omit the durable research and funding record.
- A human-readable-only update would violate the site's human/machine parity rule.
- A single combined news item would make each award harder to link and reuse independently.

## Acceptance Criteria

- AC-1: The news feed contains one linked announcement for each award.
- AC-2: The research page lists both awards with William's role and the correct final amount.
- AC-3: The grant, project, researcher, and knowledge-graph endpoints represent both awards consistently.
- AC-4: The blog post explains the distinct purpose of each project without presenting proposed work as completed evidence.
- AC-5: A fresh Jekyll build and all site and workflow evals pass.

## Risks

- A project description could overstate the final funded scope after sponsor-guided budget adjustment.
- The update mitigates this risk by using high-level award descriptions and omitting unconfirmed periods, staffing, and line-item details.
