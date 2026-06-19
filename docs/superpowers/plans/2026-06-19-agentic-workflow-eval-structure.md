# Agentic Workflow Eval Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable "slow plan, long implement" workflow kit with portable agent workflow evals, local Codex hook guidance, project scripts, and CI enforcement.

**Architecture:** Keep the workflow brain in committed, portable files: `agent-workflow.config.json`, `scripts/agent-workflow-evals.mjs`, templates, and docs. Keep Codex hooks as an adapter by committing an example hook file while leaving local `.codex/hooks.json` ignored and trust-gated. Compose the new workflow evals with the existing Jekyll/site structured-data evals instead of merging their responsibilities.

**Tech Stack:** Node.js ESM, `node:test`, npm scripts, Jekyll build output, GitHub Actions, Markdown templates, Codex hook JSON.

---

## Scope Decision

This plan implements the first reusable kit described in the approved design spec:

- Portable core: config, eval script, tests, templates, README.
- Project adapter: `package.json`, `AGENTS.md`, and GitHub Actions integration for this Jekyll repo.
- Codex adapter: committed hook example for users who want local lifecycle enforcement.

This plan does not create a repo skill in `.agents/skills/agentic-workflow` and does not package a plugin. Those are follow-on steps after the kit is used successfully on at least one real development task.

## File Structure

- Create `scripts/agent-workflow-evals.mjs`: portable Node eval runner. It validates workflow structure always and validates active run evidence only when a run file is configured, passed, or required.
- Create `scripts/agent-workflow-evals.test.mjs`: unit tests using temporary fixture directories so the workflow runner remains portable.
- Create `agent-workflow.config.json`: project adapter config for this portfolio.
- Modify `package.json`: add `eval:site`, `eval:agent`, and `eval:all`; extend `test:eval`.
- Create `docs/superpowers/README.md`: human and agent-facing guide to the workflow.
- Create `docs/superpowers/templates/spec-template.md`: reusable spec template.
- Create `docs/superpowers/templates/plan-template.md`: reusable implementation plan template.
- Create `docs/superpowers/templates/evidence-template.md`: reusable evidence template.
- Create `docs/superpowers/templates/review-template.md`: reusable review template.
- Create `docs/superpowers/templates/codex-hooks.example.json`: Codex-specific local hook adapter example.
- Create `docs/superpowers/runs/.gitkeep`: keeps the evidence directory visible without requiring an active run.
- Modify `AGENTS.md`: point future agents to the workflow and verification commands.
- Modify `.github/workflows/deploy.yml`: install Node dependencies and run evals in CI after the Jekyll build.

## Acceptance Criteria Mapping

- Written, reviewed design exists: already satisfied by `docs/superpowers/specs/2026-06-19-agentic-workflow-eval-structure-design.md`.
- Implementation plan derived from design: this plan maps each architecture unit to tasks.
- Hard and advisory findings: Task 1 implements both return channels and tests them.
- Hooks without canonical `.codex/hooks.json`: Task 2 commits `codex-hooks.example.json` and docs that explain the adapter boundary.
- Reusable across future projects: Task 2 templates and config keep Jekyll-specific details outside the runner.
- Jekyll, structured-data, and Impeccable context: Task 2 docs and `AGENTS.md` preserve site-specific verification and design context.

## Task 1: Agent Workflow Eval Runner

**Files:**
- Create: `scripts/agent-workflow-evals.test.mjs`
- Create: `scripts/agent-workflow-evals.mjs`

- [ ] **Step 1: Write failing tests for the portable eval runner**

Create `scripts/agent-workflow-evals.test.mjs` with this content:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { runAgentWorkflowEvals } from "./agent-workflow-evals.mjs";

function makeFixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-workflow-evals-"));
}

function writeFile(root, filePath, contents) {
  const absolutePath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, contents);
}

function writeJson(root, filePath, value) {
  writeFile(root, filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const baseConfig = {
  schemaVersion: 1,
  workflowName: "test-workflow",
  paths: {
    specs: "docs/superpowers/specs",
    plans: "docs/superpowers/plans",
    runs: "docs/superpowers/runs",
    readme: "docs/superpowers/README.md",
    hookExample: "docs/superpowers/templates/codex-hooks.example.json",
    agentInstructions: "AGENTS.md",
    currentRun: "docs/superpowers/runs/current.json",
    templates: [
      "docs/superpowers/templates/spec-template.md",
      "docs/superpowers/templates/plan-template.md",
      "docs/superpowers/templates/evidence-template.md",
      "docs/superpowers/templates/review-template.md",
    ],
  },
  requiredPackageScripts: {
    "eval:site": "node scripts/site-evals.mjs",
    "eval:agent": "node scripts/agent-workflow-evals.mjs",
    "eval:all": "npm run eval:site && npm run eval:agent",
  },
  requiredAgentInstructionPhrases: [
    "Slow Plan, Long Implement Workflow",
    "npm run eval:agent",
    "npm run eval:all",
  ],
};

function writeCompleteFixture(root) {
  writeJson(root, "agent-workflow.config.json", baseConfig);
  writeJson(root, "package.json", {
    scripts: {
      eval: "node scripts/site-evals.mjs",
      "eval:site": "node scripts/site-evals.mjs",
      "eval:agent": "node scripts/agent-workflow-evals.mjs",
      "eval:all": "npm run eval:site && npm run eval:agent",
    },
  });
  writeFile(root, "AGENTS.md", "# Instructions\n\n## Slow Plan, Long Implement Workflow\n\nRun `npm run eval:agent` and `npm run eval:all` before completion.\n");
  writeFile(root, "docs/superpowers/README.md", "# Superpowers Workflow\n");
  writeFile(root, "docs/superpowers/templates/spec-template.md", "# Spec Template\n\n## Goal\n\n## Acceptance Criteria\n");
  writeFile(root, "docs/superpowers/templates/plan-template.md", "# Plan Template\n\n## Task 1\n");
  writeFile(root, "docs/superpowers/templates/evidence-template.md", "# Evidence Template\n\n## Verification Commands\n");
  writeFile(root, "docs/superpowers/templates/review-template.md", "# Review Template\n\n## Findings\n");
  writeJson(root, "docs/superpowers/templates/codex-hooks.example.json", {
    description: "Example Codex hook adapter for agent workflow evals.",
    hooks: {
      Stop: [
        {
          hooks: [
            {
              type: "command",
              command: "npm run eval:agent",
              timeout: 15,
              statusMessage: "Checking agent workflow evidence",
            },
          ],
        },
      ],
    },
  });
}

describe("agent workflow evals", () => {
  it("reports missing portable workflow structure", () => {
    const root = makeFixture();
    writeJson(root, "agent-workflow.config.json", baseConfig);

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("package.json")));
    assert(result.errors.some((error) => error.includes("docs/superpowers/templates/spec-template.md")));
    assert(result.errors.some((error) => error.includes("AGENTS.md")));
  });

  it("accepts a complete workflow kit without an active run", () => {
    const root = makeFixture();
    writeCompleteFixture(root);

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it("validates active run evidence when a run file is present", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", "# Example Design\n\nStatus: Approved design\n\n## Goal\n\n## Non-Goals\n\n## Acceptance Criteria\n");
    writeFile(root, "docs/superpowers/plans/example.md", "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n");
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "complete",
      spec: "docs/superpowers/specs/example-design.md",
      plan: "docs/superpowers/plans/example.md",
      evidence: "docs/superpowers/runs/example-evidence.md",
      acceptanceCriteria: ["AC-1"],
      changedFiles: ["scripts/agent-workflow-evals.mjs"],
      planTasks: [
        {
          task: "Task 1: Build runner",
          acceptanceCriteria: ["AC-1"],
          changedFiles: ["scripts/agent-workflow-evals.mjs"],
        },
      ],
      verification: [
        {
          command: "npm run eval:agent",
          status: "passed",
          evidence: "Agent workflow evals passed",
        },
      ],
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it("emits advisory findings for vague acceptance criteria", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", "# Example Design\n\nStatus: Approved design\n\n## Goal\n\n## Non-Goals\n\n## Acceptance Criteria\n");
    writeFile(root, "docs/superpowers/plans/example.md", "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** improve quality\n\n- [x] **Step 1:** Run tests\n");
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "complete",
      spec: "docs/superpowers/specs/example-design.md",
      plan: "docs/superpowers/plans/example.md",
      evidence: "docs/superpowers/runs/example-evidence.md",
      acceptanceCriteria: ["improve quality"],
      changedFiles: ["scripts/agent-workflow-evals.mjs"],
      planTasks: [
        {
          task: "Task 1: Build runner",
          acceptanceCriteria: ["improve quality"],
          changedFiles: ["scripts/agent-workflow-evals.mjs"],
        },
      ],
      verification: [
        {
          command: "npm run eval:agent",
          status: "passed",
          evidence: "Agent workflow evals passed",
        },
      ],
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, true);
    assert(result.advisories.some((advisory) => advisory.includes("vague acceptance criterion")));
  });

  it("fails active run evidence when changed files are not mapped to plan tasks", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", "# Example Design\n\nStatus: Approved design\n\n## Goal\n\n## Non-Goals\n\n## Acceptance Criteria\n");
    writeFile(root, "docs/superpowers/plans/example.md", "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n");
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "complete",
      spec: "docs/superpowers/specs/example-design.md",
      plan: "docs/superpowers/plans/example.md",
      evidence: "docs/superpowers/runs/example-evidence.md",
      acceptanceCriteria: ["AC-1"],
      changedFiles: ["scripts/agent-workflow-evals.mjs", "AGENTS.md"],
      planTasks: [
        {
          task: "Task 1: Build runner",
          acceptanceCriteria: ["AC-1"],
          changedFiles: ["scripts/agent-workflow-evals.mjs"],
        },
      ],
      verification: [
        {
          command: "npm run eval:agent",
          status: "passed",
          evidence: "Agent workflow evals passed",
        },
      ],
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("AGENTS.md")));
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
node --test scripts/agent-workflow-evals.test.mjs
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/agent-workflow-evals.mjs`.

- [ ] **Step 3: Create the eval runner**

Create `scripts/agent-workflow-evals.mjs` with this content:

```js
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_CONFIG_PATH = "agent-workflow.config.json";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function toArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function readText(root, filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function readJson(root, filePath) {
  return JSON.parse(readText(root, filePath));
}

function fileExists(root, filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function addMissingFile(errors, root, filePath, label = filePath) {
  if (!fileExists(root, filePath)) errors.push(`${label}: required file is missing`);
}

function includesAllRequiredText(contents, requiredPhrases) {
  return requiredPhrases.filter((phrase) => !contents.includes(phrase));
}

function validateConfig(config) {
  const errors = [];
  if (!isObject(config)) return ["agent-workflow.config.json: config must be a JSON object"];
  if (config.schemaVersion !== 1) errors.push("agent-workflow.config.json: schemaVersion must be 1");
  if (!hasText(config.workflowName)) errors.push("agent-workflow.config.json: workflowName is required");
  if (!isObject(config.paths)) errors.push("agent-workflow.config.json: paths object is required");
  return errors;
}

function validatePackageScripts(root, config) {
  const errors = [];
  addMissingFile(errors, root, "package.json");
  if (!fileExists(root, "package.json")) return errors;

  let packageJson;
  try {
    packageJson = readJson(root, "package.json");
  } catch (error) {
    return [`package.json: invalid JSON: ${error.message}`];
  }

  const scripts = packageJson.scripts || {};
  for (const [name, expected] of Object.entries(config.requiredPackageScripts || {})) {
    if (scripts[name] !== expected) {
      errors.push(`package.json: script ${name} should be "${expected}"`);
    }
  }
  return errors;
}

function validateAgentInstructions(root, config) {
  const errors = [];
  const instructionsPath = config.paths?.agentInstructions;
  if (!hasText(instructionsPath)) return errors;
  addMissingFile(errors, root, instructionsPath);
  if (!fileExists(root, instructionsPath)) return errors;

  const contents = readText(root, instructionsPath);
  for (const missing of includesAllRequiredText(contents, config.requiredAgentInstructionPhrases || [])) {
    errors.push(`${instructionsPath}: missing workflow instruction phrase "${missing}"`);
  }
  return errors;
}

function validateHookExample(root, config) {
  const errors = [];
  const hookPath = config.paths?.hookExample;
  if (!hasText(hookPath)) return errors;
  addMissingFile(errors, root, hookPath);
  if (!fileExists(root, hookPath)) return errors;

  let hookConfig;
  try {
    hookConfig = readJson(root, hookPath);
  } catch (error) {
    return [`${hookPath}: invalid JSON: ${error.message}`];
  }

  const serialized = JSON.stringify(hookConfig);
  if (!serialized.includes("eval:agent")) {
    errors.push(`${hookPath}: example hook should run eval:agent`);
  }
  return errors;
}

function validateRequiredFiles(root, config) {
  const errors = [];
  const paths = config.paths || {};
  for (const filePath of [paths.readme, ...(paths.templates || [])].filter(Boolean)) {
    addMissingFile(errors, root, filePath);
  }
  return errors;
}

function validateMarkdownSections(root, filePath, requiredSections) {
  const errors = [];
  if (!fileExists(root, filePath)) return errors;
  const contents = readText(root, filePath);
  for (const section of requiredSections) {
    const pattern = new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
    if (!pattern.test(contents)) errors.push(`${filePath}: missing section "## ${section}"`);
  }
  return errors;
}

function validateSpec(root, run) {
  const errors = [];
  const specPath = run.spec;
  if (!hasText(specPath)) return ["run evidence: spec path is required"];
  addMissingFile(errors, root, specPath, "run evidence spec");
  if (!fileExists(root, specPath)) return errors;

  const spec = readText(root, specPath);
  if (!/Status:\s*Approved design/i.test(spec)) {
    errors.push(`${specPath}: spec status must include "Approved design"`);
  }
  errors.push(...validateMarkdownSections(root, specPath, ["Goal", "Non-Goals", "Acceptance Criteria"]));
  return errors;
}

function validatePlan(root, run) {
  const errors = [];
  const planPath = run.plan;
  if (!hasText(planPath)) return ["run evidence: plan path is required"];
  addMissingFile(errors, root, planPath, "run evidence plan");
  if (!fileExists(root, planPath)) return errors;

  const plan = readText(root, planPath);
  if (!/^### Task\s+\d+:/m.test(plan)) {
    errors.push(`${planPath}: plan must contain numbered task sections`);
  }
  if (!/- \[[ x]\]/i.test(plan)) {
    errors.push(`${planPath}: plan must use checkbox steps`);
  }
  return errors;
}

function validateEvidence(root, run) {
  const errors = [];
  const evidencePath = run.evidence;
  if (!hasText(evidencePath)) return ["run evidence: evidence path is required"];
  addMissingFile(errors, root, evidencePath, "run evidence file");
  if (!fileExists(root, evidencePath)) return errors;

  const evidence = readText(root, evidencePath);
  if (!/##\s+Verification Commands/i.test(evidence)) {
    errors.push(`${evidencePath}: evidence must include "## Verification Commands"`);
  }
  return errors;
}

function validateRunMappings(run) {
  const errors = [];
  const criteria = new Set(toArray(run.acceptanceCriteria).filter(hasText));
  const tasks = toArray(run.planTasks).filter(isObject);
  const mappedCriteria = new Set();
  const mappedFiles = new Set();

  if (criteria.size === 0) errors.push("run evidence: acceptanceCriteria must list at least one criterion");
  if (tasks.length === 0) errors.push("run evidence: planTasks must list at least one task");

  for (const task of tasks) {
    if (!hasText(task.task)) errors.push("run evidence: each plan task needs a task name");
    const taskCriteria = toArray(task.acceptanceCriteria).filter(hasText);
    if (taskCriteria.length === 0) errors.push(`run evidence: ${task.task || "plan task"} has no acceptance criteria`);
    for (const criterion of taskCriteria) mappedCriteria.add(criterion);
    for (const filePath of toArray(task.changedFiles).filter(hasText)) mappedFiles.add(filePath);
  }

  for (const criterion of criteria) {
    if (!mappedCriteria.has(criterion)) errors.push(`run evidence: acceptance criterion not mapped to a task: ${criterion}`);
  }

  for (const filePath of toArray(run.changedFiles).filter(hasText)) {
    if (!mappedFiles.has(filePath) && !toArray(run.outOfScopeFiles).includes(filePath)) {
      errors.push(`run evidence: changed file is not mapped to a plan task: ${filePath}`);
    }
  }

  const verification = toArray(run.verification).filter(isObject);
  if (verification.length === 0) errors.push("run evidence: verification must list at least one command");
  for (const item of verification) {
    if (!hasText(item.command)) errors.push("run evidence: verification command is required");
    if (!["passed", "blocked"].includes(item.status)) {
      errors.push(`run evidence: verification status for "${item.command || "unknown command"}" must be passed or blocked`);
    }
    if (!hasText(item.evidence)) errors.push(`run evidence: verification evidence is required for "${item.command || "unknown command"}"`);
  }

  return errors;
}

function collectRunAdvisories(run) {
  const advisories = [];
  const vagueTerms = ["improve", "polish", "make better"];

  for (const criterion of toArray(run.acceptanceCriteria).filter(hasText)) {
    const lower = criterion.toLowerCase();
    if (vagueTerms.some((term) => lower.includes(term))) {
      advisories.push(`run evidence: vague acceptance criterion may need measurable evidence: ${criterion}`);
    }
  }

  for (const task of toArray(run.planTasks).filter(isObject)) {
    if (toArray(task.changedFiles).length === 0) {
      advisories.push(`run evidence: ${task.task || "plan task"} lists no changed files`);
    }
  }

  return advisories;
}

function validateActiveRun(root, config, options = {}) {
  const errors = [];
  const advisories = [];
  const runPath = options.runPath || config.paths?.currentRun;
  const requireCurrentRun = Boolean(options.requireCurrentRun || config.requireCurrentRun);
  if (!hasText(runPath)) return { errors, advisories };

  if (!fileExists(root, runPath)) {
    if (requireCurrentRun) errors.push(`${runPath}: active run file is required`);
    return { errors, advisories };
  }

  let run;
  try {
    run = readJson(root, runPath);
  } catch (error) {
    errors.push(`${runPath}: invalid JSON: ${error.message}`);
    return { errors, advisories };
  }

  if (!isObject(run)) {
    errors.push(`${runPath}: run evidence must be a JSON object`);
    return { errors, advisories };
  }
  if (!["active", "complete"].includes(run.status)) {
    errors.push(`${runPath}: status must be active or complete`);
  }
  errors.push(...validateSpec(root, run));
  errors.push(...validatePlan(root, run));
  errors.push(...validateEvidence(root, run));
  errors.push(...validateRunMappings(run));
  advisories.push(...collectRunAdvisories(run));
  return { errors, advisories };
}

export function runAgentWorkflowEvals(projectRoot = process.cwd(), options = {}) {
  const root = path.resolve(projectRoot);
  const configPath = options.configPath || DEFAULT_CONFIG_PATH;
  const errors = [];
  const advisories = [];

  if (!fileExists(root, configPath)) {
    return {
      ok: false,
      errors: [`${configPath}: required config file is missing`],
      advisories,
    };
  }

  let config;
  try {
    config = readJson(root, configPath);
  } catch (error) {
    return {
      ok: false,
      errors: [`${configPath}: invalid JSON: ${error.message}`],
      advisories,
    };
  }

  errors.push(...validateConfig(config));
  errors.push(...validateRequiredFiles(root, config));
  errors.push(...validatePackageScripts(root, config));
  errors.push(...validateAgentInstructions(root, config));
  errors.push(...validateHookExample(root, config));
  const activeRunResult = validateActiveRun(root, config, options);
  errors.push(...activeRunResult.errors);
  advisories.push(...activeRunResult.advisories);

  return {
    ok: errors.length === 0,
    errors,
    advisories,
  };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--config") {
      options.configPath = argv[index + 1];
      index += 1;
    } else if (arg === "--run") {
      options.runPath = argv[index + 1];
      index += 1;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--require-current-run") {
      options.requireCurrentRun = true;
    }
  }
  return options;
}

const invokedUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";

if (import.meta.url === invokedUrl) {
  const options = parseArgs(process.argv.slice(2));
  const result = runAgentWorkflowEvals(process.cwd(), options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log("Agent workflow evals passed");
    for (const advisory of result.advisories) console.warn(`Advisory: ${advisory}`);
  } else {
    console.error(`Agent workflow evals failed with ${result.errors.length} issue${result.errors.length === 1 ? "" : "s"}:`);
    for (const error of result.errors) console.error(`- ${error}`);
    for (const advisory of result.advisories) console.warn(`Advisory: ${advisory}`);
  }

  process.exit(result.ok ? 0 : 1);
}
```

- [ ] **Step 4: Run the eval runner tests**

Run:

```bash
node --test scripts/agent-workflow-evals.test.mjs
```

Expected: PASS with five passing tests.

- [ ] **Step 5: Commit Task 1**

Run:

```bash
git add scripts/agent-workflow-evals.mjs scripts/agent-workflow-evals.test.mjs
git commit -m "Add agent workflow eval runner"
```

Expected: commit succeeds.

## Task 2: Portable Workflow Kit and Project Adapter

**Files:**
- Create: `agent-workflow.config.json`
- Create: `docs/superpowers/README.md`
- Create: `docs/superpowers/templates/spec-template.md`
- Create: `docs/superpowers/templates/plan-template.md`
- Create: `docs/superpowers/templates/evidence-template.md`
- Create: `docs/superpowers/templates/review-template.md`
- Create: `docs/superpowers/templates/codex-hooks.example.json`
- Create: `docs/superpowers/runs/.gitkeep`
- Modify: `package.json`
- Modify: `AGENTS.md`

- [ ] **Step 1: Run agent evals before the kit exists**

Run:

```bash
node scripts/agent-workflow-evals.mjs
```

Expected: FAIL with `agent-workflow.config.json: required config file is missing`.

- [ ] **Step 2: Add project workflow config**

Create `agent-workflow.config.json` with this content:

```json
{
  "schemaVersion": 1,
  "workflowName": "waingram-github-io-agentic-workflow",
  "paths": {
    "specs": "docs/superpowers/specs",
    "plans": "docs/superpowers/plans",
    "runs": "docs/superpowers/runs",
    "readme": "docs/superpowers/README.md",
    "hookExample": "docs/superpowers/templates/codex-hooks.example.json",
    "agentInstructions": "AGENTS.md",
    "currentRun": "docs/superpowers/runs/current.json",
    "templates": [
      "docs/superpowers/templates/spec-template.md",
      "docs/superpowers/templates/plan-template.md",
      "docs/superpowers/templates/evidence-template.md",
      "docs/superpowers/templates/review-template.md"
    ]
  },
  "requiredPackageScripts": {
    "eval:site": "node scripts/site-evals.mjs",
    "eval:agent": "node scripts/agent-workflow-evals.mjs",
    "eval:all": "npm run eval:site && npm run eval:agent"
  },
  "requiredAgentInstructionPhrases": [
    "Slow Plan, Long Implement Workflow",
    "docs/superpowers/specs/",
    "docs/superpowers/plans/",
    "npm run eval:agent",
    "npm run eval:all"
  ],
  "projectVerificationCommands": [
    "node --test scripts/site-evals.test.mjs scripts/agent-workflow-evals.test.mjs",
    "/usr/bin/env GEM_HOME=/Users/waingram/.gem GEM_PATH=/Users/waingram/.gem GEMRC=/dev/null /opt/homebrew/opt/ruby/bin/bundle exec jekyll build",
    "node scripts/site-evals.mjs _site",
    "node scripts/agent-workflow-evals.mjs"
  ],
  "requireCurrentRun": false
}
```

- [ ] **Step 3: Add workflow README**

Create `docs/superpowers/README.md` with this content:

```markdown
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

Run the site evals:

```bash
npm run eval:site
```

Run both eval layers:

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
```

- [ ] **Step 4: Add workflow templates**

Create `docs/superpowers/templates/spec-template.md` with this content:

```markdown
# [Feature Name] Design

Date: [YYYY-MM-DD]
Status: Draft design

## Goal

State the user-visible outcome in one or two precise paragraphs.

## Users and Stakeholders

- Primary user:
- Secondary users:
- Agent or maintainer stakeholders:

## Non-Goals

- Name the work that this spec intentionally excludes.

## Context

Summarize existing project files, docs, commands, and constraints that shape the design.

## Recommended Architecture

Describe the selected approach and why it fits this project.

## Alternatives Considered

- Option A:
- Option B:
- Option C:

## Acceptance Criteria

- AC-1:
- AC-2:
- AC-3:

## Risks

- Risk:
- Mitigation:
```

Create `docs/superpowers/templates/plan-template.md` with this content:

````markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** State the concrete implementation outcome.

**Architecture:** Summarize how files and responsibilities are split.

**Tech Stack:** List the project technologies and commands used by the tasks.

---

## File Structure

- Create:
- Modify:
- Test:

## Task 1: [Task Name]

**Files:**
- Create:
- Modify:
- Test:

- [ ] **Step 1: Write the failing test**

```bash
command
```

Expected: describe the specific failure.

- [ ] **Step 2: Implement the smallest passing change**

```text
Describe exact file content or patch instructions.
```

- [ ] **Step 3: Run verification**

```bash
command
```

Expected: describe the specific passing output.

- [ ] **Step 4: Commit**

```bash
git add path/to/files
git commit -m "Commit message"
```
````

Create `docs/superpowers/templates/evidence-template.md` with this content:

```markdown
# [Feature Name] Execution Evidence

Date: [YYYY-MM-DD]
Run ID: [short-run-id]
Spec: `docs/superpowers/specs/[spec-file].md`
Plan: `docs/superpowers/plans/[plan-file].md`

## Changed Files

- `path/to/file`: plan task and acceptance criteria

## Verification Commands

- `command`: passed or blocked; include the relevant output summary

## Manual Review

- Page, artifact, or workflow reviewed:
- Finding:
- Decision:

## Advisory Findings

- Finding:
- Response:
```

Create `docs/superpowers/templates/review-template.md` with this content:

```markdown
# [Feature Name] Review

Date: [YYYY-MM-DD]
Reviewer: [name or agent]

## Findings

- Severity:
- File:
- Issue:
- Recommendation:

## Residual Risk

- Risk:
- Reason accepted or follow-up:

## Verification Reviewed

- Command:
- Evidence:
```

- [ ] **Step 5: Add Codex hook example**

Create `docs/superpowers/templates/codex-hooks.example.json` with this content:

```json
{
  "description": "Example Codex adapter for the portable agent workflow evals. Copy or merge into local .codex/hooks.json only after trusting this workspace.",
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm run eval:agent",
            "timeout": 15,
            "statusMessage": "Checking agent workflow evidence"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|apply_patch",
        "hooks": [
          {
            "type": "command",
            "command": "node scripts/agent-workflow-evals.mjs --json",
            "timeout": 10,
            "statusMessage": "Checking workflow structure"
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 6: Keep the runs directory visible**

Create `docs/superpowers/runs/.gitkeep` as an empty file.

- [ ] **Step 7: Update package scripts**

Modify `package.json` so the `scripts` object is:

```json
{
  "eval": "node scripts/site-evals.mjs",
  "eval:site": "node scripts/site-evals.mjs",
  "eval:agent": "node scripts/agent-workflow-evals.mjs",
  "eval:all": "npm run eval:site && npm run eval:agent",
  "test:eval": "node --test scripts/site-evals.test.mjs scripts/agent-workflow-evals.test.mjs"
}
```

Keep the existing `devDependencies` unchanged.

- [ ] **Step 8: Update AGENTS.md**

Add this section after the `## Turn-End Commit Rule` section in `AGENTS.md`:

```markdown
## Slow Plan, Long Implement Workflow

- Use the workflow in `docs/superpowers/README.md` for multi-step development tasks.
- Approved design specs live in `docs/superpowers/specs/`.
- Implementation plans live in `docs/superpowers/plans/`.
- Execution evidence for long-running tasks lives in `docs/superpowers/runs/`.
- Keep the canonical workflow in committed files: `agent-workflow.config.json`, `scripts/agent-workflow-evals.mjs`, templates, docs, package scripts, and CI.
- Treat `.codex/hooks.json` as a local Codex adapter only. Use `docs/superpowers/templates/codex-hooks.example.json` as the committed example.
- Before claiming multi-step work is complete, run `npm run eval:agent` and the relevant project verification commands.
- Before release-oriented completion, run `npm run eval:all` against a freshly built site.
```

- [ ] **Step 9: Run eval tests and workflow eval**

Run:

```bash
npm run test:eval
```

Expected: PASS for `scripts/site-evals.test.mjs` and `scripts/agent-workflow-evals.test.mjs`.

Run:

```bash
npm run eval:agent
```

Expected: `Agent workflow evals passed`.

- [ ] **Step 10: Commit Task 2**

Run:

```bash
git add agent-workflow.config.json package.json AGENTS.md docs/superpowers/README.md docs/superpowers/templates/spec-template.md docs/superpowers/templates/plan-template.md docs/superpowers/templates/evidence-template.md docs/superpowers/templates/review-template.md docs/superpowers/templates/codex-hooks.example.json docs/superpowers/runs/.gitkeep
git commit -m "Add portable agent workflow kit"
```

Expected: commit succeeds.

## Task 3: CI Eval Integration

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Run local eval gate before CI changes**

Run:

```bash
npm run eval:agent
```

Expected: `Agent workflow evals passed`.

- [ ] **Step 2: Update the deploy workflow**

Modify `.github/workflows/deploy.yml` so the build job contains Node setup, npm install, eval tests, and eval execution. The resulting file should be:

```yaml
name: Build and Deploy Jekyll Site

on:
  push:
    branches:
      - main  # Trigger the workflow when changes are pushed to the main branch

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Check out the repository
      - name: Checkout Repository
        uses: actions/checkout@v4

      # Step 2: Set up Ruby environment
      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'  # Use a compatible Ruby version for Jekyll 4.x

      # Step 3: Set up Node.js for eval scripts
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm

      # Step 4: Install Ruby dependencies
      - name: Install Ruby Dependencies
        run: |
          gem install bundler
          bundle install

      # Step 5: Install Node dependencies
      - name: Install Node Dependencies
        run: npm ci

      # Step 6: Build the Jekyll site
      - name: Build Jekyll Site
        run: bundle exec jekyll build

      # Step 7: Run eval tests
      - name: Run Eval Tests
        run: npm run test:eval

      # Step 8: Run site and workflow evals
      - name: Run Site and Agent Workflow Evals
        run: npm run eval:all

      # Step 9: Upload artifact for deployment
      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site  # The built site directory

  deploy:
    runs-on: ubuntu-latest
    needs: build

    # Deploy to GitHub Pages
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Verify the workflow file is present and evals still pass**

Run:

```bash
npm run eval:agent
```

Expected: `Agent workflow evals passed`.

Run:

```bash
npm run test:eval
```

Expected: PASS for both eval test files.

- [ ] **Step 4: Commit Task 3**

Run:

```bash
git add .github/workflows/deploy.yml
git commit -m "Run workflow evals in deploy pipeline"
```

Expected: commit succeeds.

## Task 4: Full Local Verification

**Files:**
- No source edits expected.

- [ ] **Step 1: Run eval unit tests**

Run:

```bash
npm run test:eval
```

Expected: PASS for `scripts/site-evals.test.mjs` and `scripts/agent-workflow-evals.test.mjs`.

- [ ] **Step 2: Build the Jekyll site**

Run:

```bash
/usr/bin/env GEM_HOME=/Users/waingram/.gem GEM_PATH=/Users/waingram/.gem GEMRC=/dev/null /opt/homebrew/opt/ruby/bin/bundle exec jekyll build
```

Expected: Jekyll exits with status 0 and writes `_site`.

- [ ] **Step 3: Run site evals**

Run:

```bash
npm run eval:site
```

Expected: `Site evals passed for _site`.

- [ ] **Step 4: Run agent workflow evals**

Run:

```bash
npm run eval:agent
```

Expected: `Agent workflow evals passed`.

- [ ] **Step 5: Run combined evals**

Run:

```bash
npm run eval:all
```

Expected: both `Site evals passed for _site` and `Agent workflow evals passed`.

- [ ] **Step 6: Check the working tree**

Run:

```bash
git status --short
```

Expected: no unrelated changes. If `_site` changes appear, do not commit `_site`; it is ignored by the repo.

## Execution Notes

- Use `apply_patch` for manual file edits.
- Keep commits scoped to the task being completed.
- Do not edit local `.codex/hooks.json` during this implementation. The committed artifact is `docs/superpowers/templates/codex-hooks.example.json`.
- If `npm run eval:agent` reports missing workflow evidence while no active run is intended, inspect `docs/superpowers/runs/current.json`. The default config sets `requireCurrentRun` to `false`, so absent active-run evidence should not fail.
- If Jekyll build fails because of local Ruby environment issues, preserve completed workflow changes, commit them, and report the blocker with the failing command output.

## Self-Review Checklist

- Task 1 covers the eval runner, hard errors, advisory channel, active run behavior, and tests.
- Task 2 covers portable templates, README, config, package scripts, AGENTS instructions, and hook example.
- Task 3 covers CI enforcement without relying on `.codex/hooks.json`.
- Task 4 covers final verification for site evals, workflow evals, eval tests, and Jekyll build.
- The repo skill and plugin packaging are outside this implementation pass by design.
