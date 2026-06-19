# Agentic Workflow Eval Structure Design

Date: 2026-06-19
Status: Approved design, pending implementation plan

## Goal

Create a reusable workflow structure for "slow plan, long implement" development. The structure should help future agents perform a detailed spec interview, turn the approved spec into an executable plan, hand implementation to long-running or subagent workflows, and then use evals to detect regressions or drift.

The design must work well for this Jekyll portfolio while remaining portable enough to copy into other projects.

## Context

This site is a scholarly, expertise-driven academic and leadership portfolio. `PRODUCT.md` establishes the core product expectation: trustworthy academic credibility for collaborators, funders, students, reviewers, peers, and library technology leaders. The latest Impeccable critique snapshot also emphasizes that the site's visible design and machine-readable structure should reinforce the same intellectual seriousness.

The repo already has project-specific site evals in `scripts/site-evals.mjs` and `scripts/site-evals.test.mjs`. Those evals check sitemap output, JSON endpoints, `knowledge-graph.jsonld`, embedded JSON-LD, microdata, internal links, fragment targets, external-link safety, and banned copy regressions. This design adds a second layer: evals for the agentic development process itself.

Official OpenAI Codex documentation was reviewed on 2026-06-19 before this design was finalized. The relevant guidance supports:

- `AGENTS.md` as the durable project instruction surface that Codex reads before work.
- Skills as reusable workflow packages that can later be distributed through a plugin.
- Hooks as lifecycle validation adapters, especially for local Codex enforcement.
- Subagents as explicit execution helpers for independent implementation tasks.
- Guardrail/eval style checks as a complement to agent autonomy, not a substitute for clear specs.

## Non-Goals

- Do not implement the eval runner in this spec step.
- Do not package a Codex plugin yet.
- Do not make `.codex/hooks.json` the canonical source of workflow truth, because `.codex/` is local, ignored, and trust-gated.
- Do not replace the existing site evals; this design composes with them.
- Do not require every future project to be Jekyll. Project-specific checks belong behind adapters.

## Recommended Architecture

Use a hybrid structure with a portable core, project adapter, and Codex adapter.

### Portable Core

The portable core contains the reusable workflow contract. It should be safe to copy into another repo with minimal edits.

Files:

- `agent-workflow.config.json`
- `scripts/agent-workflow-evals.mjs`
- `docs/superpowers/templates/spec-template.md`
- `docs/superpowers/templates/plan-template.md`
- `docs/superpowers/templates/evidence-template.md`
- `docs/superpowers/templates/review-template.md`
- `docs/superpowers/README.md`

Responsibilities:

- Define required workflow artifacts.
- Check that the current task has an approved spec before implementation.
- Check that the implementation plan maps work items to acceptance criteria.
- Check that evidence files record commands, outputs, and manual review notes.
- Check that changed files are accounted for by the plan or explicitly marked as out-of-scope.
- Produce hard failures for objective violations and advisory findings for judgment-heavy risks.

### Project Adapter

The project adapter connects the portable core to this portfolio.

Files:

- `agent-workflow.config.json`
- `package.json` scripts
- Optional project-specific config sections for site eval integration

Responsibilities:

- Point the workflow evals at this repo's spec, plan, and evidence folders.
- Run the existing structured site evals as part of the final verification bundle.
- Preserve Jekyll-specific commands and Ruby notes in `AGENTS.md`.
- Allow other projects to swap in their own build/test/eval commands without changing the core workflow logic.

### Codex Adapter

The Codex adapter improves local agent compliance, but it should not be the only enforcement layer.

Files:

- `docs/superpowers/templates/codex-hooks.example.json`
- Optional install or merge script in a later implementation phase
- Local `.codex/hooks.json`, if the user chooses to install the hook adapter

Responsibilities:

- Provide a trusted example hook that runs fast workflow checks at lifecycle moments.
- Keep local `.codex/hooks.json` out of the canonical repo contract while still documenting the recommended Codex setup.
- Avoid long-running or flaky hook work. Hooks should surface immediate drift and defer full verification to explicit eval commands and CI.

Recommended hook shape:

- `Stop`: run `npm run eval:agent` so a turn cannot quietly end with missing workflow artifacts.
- `PostToolUse`: optionally run a lightweight advisory check after edits to specs, plans, templates, or workflow files.
- Keep existing Impeccable design hooks separate from agent workflow hooks, because they enforce different concerns.

## Workflow Model

The reusable workflow has four phases.

1. Spec Interview

   The agent conducts a slow, explicit design conversation before code changes. The output is an approved spec in `docs/superpowers/specs/`.

2. Implementation Plan

   The agent writes a plan that maps tasks to acceptance criteria, verification commands, files likely to change, and handoff boundaries for subagents or long-running implementation.

3. Long Implementation

   The agent or subagents execute the plan. Each implementation unit records evidence as it works: commands run, failures observed, manual checks, screenshots when relevant, and decisions that affected scope.

4. Eval Gate

   The agent runs the workflow evals and project evals before claiming completion. Hard failures block completion. Advisory findings require acknowledgment and either a fix or an explicit rationale.

## Hard Gates

Hard gates should fail the eval command when objective workflow evidence is missing or malformed.

- A spec exists for the current task.
- The spec includes goal, non-goals, users or stakeholders, constraints, risks, and acceptance criteria.
- The spec status is approved before implementation artifacts are marked active.
- A plan exists for implemented work.
- Each plan task maps to one or more acceptance criteria.
- Evidence exists for completed tasks.
- Evidence records verification commands, command outcomes, and any blocked checks.
- Changed project files are mapped to plan tasks or documented as incidental changes.
- Final verification includes project-level commands, including site evals for this repo.
- Structured output files are checked when the project produces sitemap, JSON, JSON-LD, or embedded structured data.

## Advisory Findings

Advisory findings should not fail by default, but they should be visible enough that an agent has to address them in the final report.

- The spec uses vague acceptance criteria such as "improve", "polish", or "make better" without measurable examples.
- The plan contains tasks that are not connected to an acceptance criterion.
- The diff includes files outside the expected areas.
- The evidence mentions manual review without an artifact, URL, screenshot, or note.
- The implementation added new tools, dependencies, schemas, or build steps without a spec note.
- The work touches UI but does not reference the current product or critique context.
- The work touches structured data but does not mention schema validation.
- The final response claims completion without listing the verification evidence.

## Site-Specific Verification Bundle

For this portfolio, the final verification bundle should include:

- Jekyll build using the Ruby/Bundler command from `AGENTS.md`.
- Existing site evals against the built `_site` output.
- Agent workflow evals.
- Any targeted tests added for changed workflow scripts.
- Browser review when UI output changes.

The structured-data portion should keep covering:

- `sitemap.xml`
- JSON endpoints
- `knowledge-graph.jsonld`
- Embedded JSON-LD in HTML
- Microdata attributes in HTML
- Schema.org entities used by the site, including Person, ScholarlyArticle, Article or BlogPosting, Event, WebSite, WebPage, and BreadcrumbList where applicable
- Google-rich-result-sensitive entities such as Event when the site publishes event-like entries

## Package Scripts

Add script names that distinguish site correctness from process correctness.

Recommended scripts:

- `eval:site`: run the existing site evals.
- `test:eval`: run tests for eval scripts.
- `eval:agent`: run portable workflow evals.
- `eval:all`: run site evals and agent workflow evals.

Keep `eval` as an alias only if it remains unambiguous. For this repo, `eval` can initially continue to mean site evals, then `eval:all` becomes the standard release gate.

## CI Strategy

CI should enforce durable project behavior rather than local Codex behavior.

Recommended CI sequence:

1. Install dependencies.
2. Build the Jekyll site.
3. Run `npm run test:eval`.
4. Run `npm run eval:all` against the built site.

The CI job should not depend on `.codex/hooks.json`. Hooks are for local agent feedback; CI is the shared enforcement layer.

## Reproducibility Strategy

The first reusable form should be a copyable project kit:

- Workflow templates in `docs/superpowers/templates/`.
- One portable workflow eval script.
- One small config file.
- One documented hook example.
- One README explaining setup and expected commands.

After the pattern proves useful in this repo, the next reusable form should be a repo skill under `.agents/skills/agentic-workflow`. After that, if it is useful across several projects, package it as a Codex plugin so the workflow can be installed instead of copied.

## Boundaries and Interfaces

The workflow eval script should have a simple interface:

```bash
node scripts/agent-workflow-evals.mjs
node scripts/agent-workflow-evals.mjs --config agent-workflow.config.json
node scripts/agent-workflow-evals.mjs --json
```

It should read configuration from `agent-workflow.config.json` and project state from the git working tree. It should not know about Jekyll, publications, or schema.org directly. Project-specific commands and artifacts belong in config.

The site eval script should remain responsible for built-site correctness. The agent workflow eval script should remain responsible for process evidence and scope control.

## Acceptance Criteria

- The repo has a written, reviewed design for reusable agentic workflow evals.
- The implementation plan can be derived from this design without re-litigating the architecture.
- The design distinguishes hard gates from advisory findings.
- The design explains how hooks fit without making local `.codex/hooks.json` the canonical source of truth.
- The design explains how this becomes reusable across future projects.
- The design preserves this site's existing Jekyll, structured-data, and Impeccable design context.

## Risks

- The evals could become paperwork if they check for artifacts without checking meaningful connections between spec, plan, evidence, and diff.
- Hooks could create false confidence if they are treated as the only enforcement layer.
- The first implementation could overfit to this Jekyll repo and lose portability.
- Advisory findings could become noisy if they are too broad or worded like hard failures.
- A long implementation agent could still drift if plans are too vague or acceptance criteria are not testable.

Mitigations:

- Keep objective checks hard and judgment-heavy checks advisory.
- Put the canonical workflow in committed templates, config, scripts, and `AGENTS.md`, not local hooks.
- Keep site-specific logic in config or existing site evals.
- Require final evidence to connect commands, outputs, changed files, and acceptance criteria.

## Open Decisions for the Implementation Plan

- Whether to add a lightweight `docs/superpowers/runs/` evidence directory immediately or wait until the first development task uses it.
- Whether `eval` should stay as an alias for `eval:site` or move to `eval:all`.
- Whether to add CI workflow changes in the first implementation pass or after local evals prove stable.
- Whether to create the repo skill in the first implementation pass or treat it as a follow-up once the portable kit works.

The recommended first implementation pass should create the portable kit and project adapter, update `AGENTS.md`, add tests, and document the Codex hook example. The repo skill and plugin packaging should follow after one real development task uses the workflow successfully.
