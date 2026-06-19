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

const projectVerificationCommands = [
  "node --test scripts/site-evals.test.mjs scripts/agent-workflow-evals.test.mjs",
  "bundle exec jekyll build",
  "node scripts/site-evals.mjs _site",
  "node scripts/agent-workflow-evals.mjs",
];

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
  projectVerificationCommands,
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function approvedSpec({ without = [] } = {}) {
  const sections = [
    ["Goal", "Build a portable agent workflow."],
    ["Users and Stakeholders", "- Primary user: maintainer"],
    ["Non-Goals", "- Rewrite unrelated project workflows."],
    ["Constraints", "- Keep checks runnable in local and CI environments."],
    ["Risks", "- Missing evidence could hide incomplete work."],
    ["Acceptance Criteria", "- AC-1: Workflow evidence is validated."],
  ];
  const body = sections
    .filter(([section]) => !without.includes(section))
    .map(([section, contents]) => `## ${section}\n\n${contents}\n`)
    .join("\n");

  return `# Example Design\n\nStatus: Approved design\n\n${body}`;
}

function verificationBundle(commands = projectVerificationCommands) {
  return commands.map((command) => ({
    command,
    status: "passed",
    evidence: `${command} passed`,
  }));
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
  writeFile(
    root,
    "docs/superpowers/templates/spec-template.md",
    "# Spec Template\n\n## Goal\n\n## Users and Stakeholders\n\n## Non-Goals\n\n## Constraints\n\n## Risks\n\n## Acceptance Criteria\n",
  );
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

  it("validates complete run evidence when a run file is present", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
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
      verification: verificationBundle(),
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it("fails complete run evidence when a configured project verification command is missing", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
    );
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n");
    const missingCommand = "node scripts/site-evals.mjs _site";
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
      verification: verificationBundle(projectVerificationCommands.filter((command) => command !== missingCommand)),
    });

    const result = runAgentWorkflowEvals(root, { configPath: "agent-workflow.config.json" });

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes(missingCommand)));
  });

  it("fails run evidence when required spec hard-gate sections are missing", () => {
    for (const missingSection of ["Constraints", "Users and Stakeholders"]) {
      const root = makeFixture();
      writeCompleteFixture(root);
      writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec({ without: [missingSection] }));
      writeFile(
        root,
        "docs/superpowers/plans/example.md",
        "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
      );
      writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
      writeJson(root, "docs/superpowers/runs/current.json", {
        id: "example",
        status: "active",
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

      assert.equal(result.ok, false);
      assert(result.errors.some((error) => error.includes(`## ${missingSection}`)));
    }
  });

  it("fails run evidence when a plan task heading is missing from run planTasks", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      [
        "# Example Implementation Plan",
        "",
        "### Task 1: Build runner",
        "",
        "**Acceptance Criteria:** AC-1",
        "",
        "- [x] **Step 1:** Run tests",
        "",
        "### Task 2: Extra work",
        "",
        "**Acceptance Criteria:** AC-2",
        "",
        "- [ ] **Step 1:** Add extra work",
        "",
      ].join("\n"),
    );
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "active",
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

    assert.equal(result.ok, false);
    assert(result.errors.some((error) => error.includes("Task 2: Extra work")));
  });

  it("fails run evidence when a run plan task is not present in the plan file", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
    );
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "active",
      spec: "docs/superpowers/specs/example-design.md",
      plan: "docs/superpowers/plans/example.md",
      evidence: "docs/superpowers/runs/example-evidence.md",
      acceptanceCriteria: ["AC-1"],
      changedFiles: ["scripts/agent-workflow-evals.mjs"],
      planTasks: [
        {
          task: "Task 1: Build runner",
          acceptanceCriteria: ["AC-1"],
        },
        {
          task: "Task 2: Fabricated task",
          acceptanceCriteria: ["AC-2"],
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
    assert(result.errors.some((error) => error.includes("Task 2: Fabricated task")));
  });

  it("emits advisory findings for vague acceptance criteria", () => {
    const root = makeFixture();
    writeCompleteFixture(root);
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** improve quality\n\n- [x] **Step 1:** Run tests\n",
    );
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "active",
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
    writeFile(root, "docs/superpowers/specs/example-design.md", approvedSpec());
    writeFile(
      root,
      "docs/superpowers/plans/example.md",
      "# Example Implementation Plan\n\n### Task 1: Build runner\n\n**Acceptance Criteria:** AC-1\n\n- [x] **Step 1:** Run tests\n",
    );
    writeFile(root, "docs/superpowers/runs/example-evidence.md", "# Evidence\n\n## Verification Commands\n\n- `npm run eval:agent`: passed\n");
    writeJson(root, "docs/superpowers/runs/current.json", {
      id: "example",
      status: "active",
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
