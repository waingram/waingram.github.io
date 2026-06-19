# Codex Project Instructions

## Turn-End Commit Rule

- At the end of every turn where the agent changes project files, stage and commit the changes before the final response.
- Keep commits scoped to the files changed for the current user request.
- Do not commit unrelated user changes or untracked files unless the user explicitly asks.
- Do not create empty commits when no project files changed; instead, state that no commit was needed.
- If verification is blocked by the local environment, commit the completed changes and report the verification blocker.
- Use non-interactive Git commands.

## Slow Plan, Long Implement Workflow

- Use the workflow in `docs/superpowers/README.md` for multi-step development tasks.
- Approved design specs live in `docs/superpowers/specs/`.
- Implementation plans live in `docs/superpowers/plans/`.
- Execution evidence for long-running tasks lives in `docs/superpowers/runs/`.
- Keep the canonical workflow in committed files: `agent-workflow.config.json`, `scripts/agent-workflow-evals.mjs`, templates, docs, package scripts, and CI.
- Treat `.codex/hooks.json` as a local Codex adapter only. Use `docs/superpowers/templates/codex-hooks.example.json` as the committed example.
- Before claiming multi-step work is complete, run `npm run eval:agent` and the relevant project verification commands.
- Before release-oriented completion, run `npm run eval:all` against a freshly built site.

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

## Publishing

- The site does not rely on GitHub Pages' default Jekyll build workflow.
- Publishing is handled by the custom GitHub Actions workflow in `.github/workflows/deploy.yml`.
- The workflow runs on pushes to `main`, builds the site with Ruby 3.1 using `bundle exec jekyll build`, uploads `./_site` as a Pages artifact, and deploys it with `actions/deploy-pages`.
- Treat `.github/workflows/deploy.yml` as the source of truth for production build behavior. If build dependencies or Ruby assumptions change, check the workflow as well as local setup notes.

## Ruby 4.0 Compatibility

Ruby 4.0 dropped `logger` from stdlib. The `gem "logger"` line in `Gemfile` is required to run Jekyll locally. GitHub Pages builds with an older Ruby and does not need this.

## Project Structure

- `_data/publications/*.bib` contains BibTeX source files across eight categories and is rendered via `jekyll-scholar`.
- `_layouts/scholar/` contains per-entry bibliography templates.
- `_includes/` contains page-level content components; layout routing is handled in `_layouts/default.html`.
- `_config.yml` configures Jekyll Scholar to use ACM citation style and read from `_data/publications/`.
- There is no `_layouts/bibliography.html` override; the jekyll-scholar default `<ol class="bibliography">` wrapper is active.
- CSS counters in `main.css` drive the `[1] [2]` numbered markers on `.bibliography li`.
