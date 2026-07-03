import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const layout = fs.readFileSync(new URL("../_layouts/default.html", import.meta.url), "utf8");
const header = fs.readFileSync(new URL("../_includes/header.html", import.meta.url), "utf8");
const home = fs.readFileSync(new URL("../_includes/home.html", import.meta.url), "utf8");

function homepageActions() {
  const actionsBlock = home.match(/<div class="hero-actions" aria-label="Primary site sections">([\s\S]*?)<\/div>/);
  assert.ok(actionsBlock, "homepage primary actions block is present");

  return [...actionsBlock[1].matchAll(/<a class="([^"]+)" href="\{\{ '([^']+)' \| relative_url \}\}">\s*([^<]+?)\s*<\/a>/g)]
    .map((match) => ({
      className: match[1],
      href: match[2],
      label: match[3],
    }));
}

describe("theme source markup", () => {
  it("applies explicit saved themes before stylesheets load", () => {
    const stylesheetIndex = layout.indexOf('<link rel="stylesheet" href="{{ \'/css/normalize.css\' | relative_url }}">');
    const themeColorMetaIndex = layout.indexOf('<meta name="theme-color" content="#f7f9fb">');
    const themeScriptIndex = layout.indexOf("window.__waiApplyInitialTheme");

    assert.notEqual(themeColorMetaIndex, -1);
    assert.notEqual(themeScriptIndex, -1);
    assert.ok(themeColorMetaIndex < themeScriptIndex);
    assert.ok(themeScriptIndex < stylesheetIndex);
    assert.match(layout, /localStorage\.getItem\("themePreference"\)/);
    assert.match(layout, /document\.documentElement\.dataset\.theme = preference/);
    assert.match(layout, /window\.matchMedia && window\.matchMedia\("\(prefers-color-scheme: dark\)"\)\.matches/);
    assert.match(layout, /document\.documentElement\.style\.colorScheme = effectiveTheme/);
    assert.match(layout, /document\.querySelector\('meta\[name="theme-color"\]'\)/);
    assert.match(layout, /themeColor\.setAttribute\("content", effectiveTheme === "dark" \? "#0d151d" : "#f7f9fb"\)/);
    assert.equal(layout.match(/<meta name="theme-color" content="#f7f9fb">/g)?.length, 1);
  });

  it("renders compact theme menu controls in the navbar", () => {
    assert.match(header, /data-theme-switcher/);
    assert.match(header, /data-theme-toggle/);
    assert.match(header, /aria-haspopup="menu"/);
    assert.match(header, /aria-expanded="false"/);
    assert.match(header, /data-theme-menu/);
    assert.match(header, /role="menu"/);

    for (const theme of ["system", "light", "dark"]) {
      assert.match(header, new RegExp(`data-theme-choice="${theme}"`));
      assert.match(header, new RegExp(`data-theme-icon="${theme}"`));
    }
  });

  it("renders the homepage primary actions as four consistent section buttons", () => {
    assert.deepEqual(homepageActions(), [
      { className: "btn btn-primary", href: "/experience/", label: "Experience" },
      { className: "btn btn-primary", href: "/research/", label: "Research" },
      { className: "btn btn-primary", href: "/publications/", label: "Publications" },
      { className: "btn btn-primary", href: "/blog/", label: "Blog" },
    ]);
  });
});
