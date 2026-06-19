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

function validateConfig(config, configPath) {
  const errors = [];
  if (!isObject(config)) return [`${configPath}: config must be a JSON object`];
  if (config.schemaVersion !== 1) errors.push(`${configPath}: schemaVersion must be 1`);
  if (!hasText(config.workflowName)) errors.push(`${configPath}: workflowName is required`);
  if (!isObject(config.paths)) errors.push(`${configPath}: paths object is required`);
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

  const lines = readText(root, filePath).split(/\r?\n/);
  for (const section of requiredSections) {
    const requiredHeading = `## ${section}`;
    if (!lines.includes(requiredHeading)) {
      errors.push(`${filePath}: missing section "${requiredHeading}"`);
    }
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
  if (!evidence.split(/\r?\n/).some((line) => line.trim() === "## Verification Commands")) {
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
  const outOfScopeFiles = new Set(toArray(run.outOfScopeFiles).filter(hasText));

  if (criteria.size === 0) errors.push("run evidence: acceptanceCriteria must list at least one criterion");
  if (tasks.length === 0) errors.push("run evidence: planTasks must list at least one task");

  for (const task of tasks) {
    if (!hasText(task.task)) errors.push("run evidence: each plan task needs a task name");

    const taskCriteria = toArray(task.acceptanceCriteria).filter(hasText);
    if (taskCriteria.length === 0) {
      errors.push(`run evidence: ${task.task || "plan task"} has no acceptance criteria`);
    }
    for (const criterion of taskCriteria) mappedCriteria.add(criterion);
    for (const filePath of toArray(task.changedFiles).filter(hasText)) mappedFiles.add(filePath);
  }

  for (const criterion of criteria) {
    if (!mappedCriteria.has(criterion)) {
      errors.push(`run evidence: acceptance criterion not mapped to a task: ${criterion}`);
    }
  }

  for (const filePath of toArray(run.changedFiles).filter(hasText)) {
    if (!mappedFiles.has(filePath) && !outOfScopeFiles.has(filePath)) {
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
    if (!hasText(item.evidence)) {
      errors.push(`run evidence: verification evidence is required for "${item.command || "unknown command"}"`);
    }
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
    if (toArray(task.changedFiles).filter(hasText).length === 0) {
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

  errors.push(...validateConfig(config, configPath));
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
