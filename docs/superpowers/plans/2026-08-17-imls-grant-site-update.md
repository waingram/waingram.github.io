# 2026 IMLS Grant Site Update Implementation Plan

**Goal:** Add the two 2026 IMLS awards to every relevant public and machine-readable website surface and prepare a connected blog post.

**Architecture:** The news feed and research include provide the visible record, while the JSON and JSON-LD endpoints preserve machine-readable parity.

**Tech Stack:** Jekyll, Liquid, YAML, JSON, JSON-LD, Markdown, Node.js eval scripts.

## File Structure

- Create: `_posts/2026-08-17-two-new-imls-grants-for-auditable-ai-in-library-work.md`
- Modify: `_data/news.yml`, `_includes/research.html`, `_pages/grants.json`, `_pages/projects.json`, `_pages/research.json`, `_pages/knowledge-graph.jsonld`
- Test: Jekyll build, Node test suite, site evals, agent-workflow evals

### Task 1: Add the public announcements

- [x] Add two linked August 2026 news records.
- [x] Draft the blog post in William's public academic voice.

### Task 2: Update the human-readable research record

- [x] Add both projects to the research-program narrative.
- [x] Add both grant awards to the visible funding list.

### Task 3: Update structured research records

- [x] Add both awards to `grants.json`.
- [x] Add both projects to `projects.json`.
- [x] Update the researcher profile and JSON-LD graph.

### Task 4: Verify and commit

- [x] Build the Jekyll site.
- [x] Run the unit, site, and workflow evals.
- [x] Review and commit only the files in this update.
