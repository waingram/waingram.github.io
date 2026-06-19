# Superpowers Agentic Workflow

This directory contains the reusable workflow kit for "slow plan, long implement" development.

## Purpose

Use this workflow when a task needs more than a direct single edit. The workflow keeps the project grounded in an approved spec, an implementation plan, evidence from execution, and evals that catch drift before completion.

## Phases

1. Spec interview: write the approved design in `docs/superpowers/specs/`.
2. Implementation plan: write the task-by-task plan in `docs/superpowers/plans/`.
3. Long implementation: execute the plan with `superpowers:subagent-driven-development` or `superpowers:executing-plans`.
4. Eval gate: run project and workflow evals before claiming completion.

## Commands

Run the workflow evals:

```bash
npm run eval:agent
```

Before running site evals, build `_site` from the current source. The portable command is:

```bash
bundle exec jekyll build
```

For local workstation-specific Ruby or Bundler paths, follow `AGENTS.md`.

Run the site evals against the freshly built `_site`:

```bash
npm run eval:site
```

Run both eval layers after a fresh site build:

```bash
npm run eval:all
```

Run eval unit tests:

```bash
npm run test:eval
```

## Codex Hooks

The committed hook example is `docs/superpowers/templates/codex-hooks.example.json`.

Local `.codex/hooks.json` is intentionally not the canonical workflow source. It is ignored and trust-gated by Codex. Copy or merge the example into local Codex configuration when local lifecycle checks are useful, but keep the durable workflow contract in `agent-workflow.config.json`, scripts, templates, docs, and CI.

## Evidence Runs

Use `docs/superpowers/runs/` for active task evidence when a task needs durable process tracking. `docs/superpowers/runs/current.json` is optional by default. When present, `npm run eval:agent` validates that the run links an approved spec, plan, evidence file, changed files, acceptance criteria, and verification commands.
