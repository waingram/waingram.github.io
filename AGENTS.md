# Codex Project Instructions

## Turn-End Commit Rule

- At the end of every turn where the agent changes project files, stage and commit the changes before the final response.
- Keep commits scoped to the files changed for the current user request.
- Do not commit unrelated user changes or untracked files unless the user explicitly asks.
- Do not create empty commits when no project files changed; instead, state that no commit was needed.
- If verification is blocked by the local environment, commit the completed changes and report the verification blocker.
- Use non-interactive Git commands.

## Environment

- Ruby: `/opt/homebrew/opt/ruby/bin/` (Ruby 4.0.1 via Homebrew)
- Bundler/Jekyll: prefix commands with `/opt/homebrew/opt/ruby/bin/bundle exec`
- Gems: installed in `~/.gem/gems/`

## Common Commands

```bash
# Build the site
/opt/homebrew/opt/ruby/bin/bundle exec jekyll build

# Serve locally (http://localhost:4000)
/opt/homebrew/opt/ruby/bin/bundle exec jekyll serve --port 4000

# Install/update gems
/opt/homebrew/opt/ruby/bin/bundle install
```

## Ruby 4.0 Compatibility

Ruby 4.0 dropped `logger` from stdlib. The `gem "logger"` line in `Gemfile` is required to run Jekyll locally. GitHub Pages builds with an older Ruby and does not need this.

## Project Structure

- `_data/publications/*.bib` contains BibTeX source files across eight categories and is rendered via `jekyll-scholar`.
- `_layouts/scholar/` contains per-entry bibliography templates.
- `_includes/` contains page-level content components; layout routing is handled in `_layouts/default.html`.
- `_config.yml` configures Jekyll Scholar to use ACM citation style and read from `_data/publications/`.
- There is no `_layouts/bibliography.html` override; the jekyll-scholar default `<ol class="bibliography">` wrapper is active.
- CSS counters in `main.css` drive the `[1] [2]` numbered markers on `.bibliography li`.

## Machine-Readable Research Graph

- The site exposes agent-facing structured resources at `/research.json`, `/projects.json`, `/grants.json`, `/publications.json`, and `/knowledge-graph.jsonld`.
- `_layouts/default.html` advertises these resources with `rel="alternate"` links in the HTML head.
- `/publications.json` must remain dynamically generated from `_data/publications/*.bib`; do not replace it with a hand-coded static publication list.
- The JSON publication pipeline uses `_pages/publications.json`, `_includes/bibliography_json_items.html`, and `_layouts/scholar/bib_template_json.html`.
- `_layouts/scholar/bib_template_json.html` intentionally omits optional fields when they are absent instead of emitting JSON `null` values.

## Structured Data Notes

- The home page uses `ProfilePage` with a `Person` object as `mainEntity`; this fixed a Google Search Console Profile page issue.
- Do not put a `Person` object directly in the `mainEntity` microdata attribute on `_includes/home.html`; the page-level JSON-LD in `_layouts/default.html` is the canonical structured data path.
- Event schema markup was removed from publication and workshop templates because incomplete `Event` objects triggered Search Console issues.
- Do not reintroduce `schema.org/Event` markup unless all Google-required fields are available: at minimum `name`, `location`, and valid date information.

## Research Framing

- The research page should present a coherent program on machine-usable scientific and scholarly knowledge, not a chronology of older technologies.
- OAI-PMH, NDLTD, metadata standards, ETDs, NLP, retrieval, LLMs, and workflow extraction should appear as manifestations of the same problem: transforming research knowledge into forms that machines can find, interpret, and reuse.
- The dissertation should be described as work on goal-conditioned evaluation in scholarly collections, not as a generic SDG classification project.
- Do not describe the dissertation as an empirical study of human judgment variation. It used disagreement and interpretive pluralism to motivate why a single ground truth is the wrong target for SDG relevance assessment.
- Physical AI, digital twins, and Genesis-adjacent language should be handled with restraint. Signal alignment through knowledge representation, workflow-like knowledge, research processes, and AI-assisted discovery rather than direct claims that overstate completed work.

## Prose Guidelines

- Avoid formulaic signposting such as an introductory setup phrase followed by a colon and a direct question or claim.
- Avoid `not only ... but also ...`.
- Avoid inflated terms such as `critical`, `crucial`, `essential`, or `significant` unless the claim literally requires that strength.
- Prefer precise verbs and nouns over branding-like repetition. In recent research prose, repeated phrases such as `computationally accessible, provenance-aware, and reusable` were intentionally reduced.
