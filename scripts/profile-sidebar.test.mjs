import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const sidebar = fs.readFileSync(new URL("../_includes/sidebar.html", import.meta.url), "utf8");
const layout = fs.readFileSync(new URL("../_layouts/default.html", import.meta.url), "utf8");
const researchJson = fs.readFileSync(new URL("../_pages/research.json", import.meta.url), "utf8");
const knowledgeGraph = fs.readFileSync(new URL("../_pages/knowledge-graph.jsonld", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/main.css", import.meta.url), "utf8");
const packageJson = fs.readFileSync(new URL("../package.json", import.meta.url), "utf8");

const VT_EXPERTS_URL = "https://experts.vt.edu/5675-william-a-ingram";

function labelsFromSidebar() {
  return [...sidebar.matchAll(/<span class="label"[^>]*>([^<]+)<\/span>/g)].map((match) => match[1].trim());
}

function visibleText(source) {
  return source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function blockFor(selector, source = css) {
  const escaped = escapeRegExp(selector);
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`));
  assert.ok(match, `${selector} block is present`);
  return match[1];
}

function blockContentsStartingAt(openIndex) {
  let depth = 0;

  for (let index = openIndex; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(openIndex + 1, index);
  }

  assert.fail("CSS block is closed");
}

function mediaBlockFor(query) {
  const prelude = `@media ${query}`;
  const mediaIndex = css.indexOf(prelude);
  assert.notEqual(mediaIndex, -1, `${prelude} block is present`);

  const openIndex = css.indexOf("{", mediaIndex);
  assert.notEqual(openIndex, -1, `${prelude} block has an opening brace`);
  return blockContentsStartingAt(openIndex);
}

describe("profile sidebar", () => {
  it("shows the Ph.D. suffix as part of the visible name", () => {
    assert.match(sidebar, /,\s*<span class="profile-honorific" itemprop="honorificSuffix">Ph\.D\.<\/span>/);
    assert.match(visibleText(sidebar), /William\s+A\.\s+Ingram\s*,\s+Ph\.D\./);
  });

  it("uses the standard page container for steadier sidebar margins", () => {
    assert.match(layout, /<div class="container my-md-4 mt-4">/);
    assert.doesNotMatch(layout, /container-xxl my-md-4 mt-4/);
  });

  it("orders profile links for scholarly verification and an even mobile grid", () => {
    assert.deepEqual(labelsFromSidebar(), [
      "VT Experts",
      "ORCID",
      "Google Scholar",
      "DBLP",
      "Scopus",
      "LinkedIn",
      "GitHub",
      "Bluesky",
      "Strava",
      "Blacksburg, VA",
    ]);
    assert.equal(labelsFromSidebar().length % 2, 0);
    assert.match(sidebar, new RegExp(`href="${escapeRegExp(VT_EXPERTS_URL)}"`));
    assert.match(sidebar, /profile-link-icon-vt/);
  });

  it("keeps the Experts profile in machine-readable identity signals", () => {
    for (const source of [layout, researchJson, knowledgeGraph]) {
      assert.match(source, new RegExp(escapeRegExp(VT_EXPERTS_URL)));
    }
  });

  it("uses GitHub-inspired compact, non-sticky sidebar sizing", () => {
    assert.doesNotMatch(css, /position:\s*sticky/);
    assert.match(blockFor(".profile-sidebar"), /--wai-profile-avatar-size:\s*13\.25rem;/);
    assert.match(blockFor(".profile-sidebar h1"), /font-size:\s*1\.58rem;/);
    assert.match(blockFor("#profile_image"), /max-width:\s*var\(--wai-profile-avatar-size\);/);
  });

  it("uses a stable two-column mobile link grid", () => {
    const mobileBlock = mediaBlockFor("(max-width: 767.98px)");
    assert.match(mobileBlock, /\.profile-summary\s*\{[\s\S]*align-items:\s*center !important;/);
    assert.match(mobileBlock, /\.profile-summary\s*\{[\s\S]*flex-direction:\s*column;/);
    assert.match(mobileBlock, /#profile_image\s*\{[\s\S]*margin-right:\s*0 !important;/);
    assert.match(mobileBlock, /\.profile-name\s*\{[\s\S]*text-align:\s*center;/);
    assert.match(mobileBlock, /\.profile-name\s*\{[\s\S]*width:\s*100% !important;/);
    assert.match(mobileBlock, /\.profile-meta\s*\{[\s\S]*text-align:\s*center;/);
    assert.match(mobileBlock, /\.profile-links\s*\{[\s\S]*display:\s*grid !important;/);
    assert.match(mobileBlock, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/);
    assert.match(mobileBlock, /--wai-profile-avatar-size:\s*4\.25rem;/);
  });

  it("runs with the project eval test script", () => {
    const pkg = JSON.parse(packageJson);
    assert.match(pkg.scripts["test:eval"], /scripts\/profile-sidebar\.test\.mjs/);
  });
});
