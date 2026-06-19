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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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
  writeFile(
    root,
    "AGENTS.md",
    "# Instructions\n\n## Slow Plan, Long Implement Workflow\n\nRun `npm run eval:agent` and `npm run eval:all` before completion.\n",
  );
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

  it("reports malformed or minimal workflow config shape", () => {
    const root = makeFixture();
    writeJson(root, "agent-workflow.config.json", {
      schemaVersion: 1,
      workflowName: "minimal-workflow",
      paths: {},
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("paths.readme")));
    assert(result.errors.some((error) => error.includes("paths.agentInstructions")));
    assert(result.errors.some((error) => error.includes("paths.hookExample")));
    assert(result.errors.some((error) => error.includes("paths.templates")));
    assert(result.errors.some((error) => error.includes("requiredPackageScripts")));
    assert(result.errors.some((error) => error.includes("requiredAgentInstructionPhrases")));
  });

  it("requires a configured active run path when current run evidence is required", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    const config = clone(baseConfig);
    delete config.paths.currentRun;
    writeJson(root, "agent-workflow.config.json", config);

    const result = runAgentWorkflowEvals(root, {
      configPath: "agent-workflow.config.json",
      requireCurrentRun: true,
    });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("currentRun")));
  });

  it("returns config errors instead of throwing when templates has the wrong type", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    const config = clone(baseConfig);
    config.paths.templates = 42;
    writeJson(root, "agent-workflow.config.json", config);

    let result;
    assert.doesNotThrow(() => {
      result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });
    });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("paths.templates")));
  });

  it("requires hook command strings to run eval:agent", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeJson(root, "docs/superpowers/templates/codex-hooks.example.json", {
      description: "This example talks about eval:agent but does not run it.",
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: "command",
                command: "npm test",
              },
            ],
          },
        ],
      },
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("eval:agent")));
  });

  it("validates active run evidence when a run file is present", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(
      root,
      "docs/superpowers/specs/example-design.md",
      "# Example Design\n\nStatus: Approved design\n\n##  Goal\n\n## Non-Goals  \n\n##   Acceptance Criteria\n",
    );
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
    );
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
    writeFile(
      root,
      "docs/superpowers/specs/example-design.md",
      "# Example Design\n\nStatus: Approved design\n\n## Goal\n\n## Non-Goals\n\n## Acceptance Criteria\n",
    );
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** improve quality\n\n- [x] **Step 1:** Run tests\n",
    );
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
    writeFile(
      root,
      "docs/superpowers/specs/example-design.md",
      "# Example Design\n\nStatus: Approved design\n\n## Goal\n\n## Non-Goals\n\n## Acceptance Criteria\n",
    );
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
    );
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
