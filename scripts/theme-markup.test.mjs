import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const layout = fs.readFileSync(new URL("../_layouts/default.html", import.meta.url), "utf8");
const header = fs.readFileSync(new URL("../_includes/header.html", import.meta.url), "utf8");

describe("theme source markup", () => {
  it("applies explicit saved themes before stylesheets load", () => {
    const stylesheetIndex = layout.indexOf('<link rel="stylesheet" href="{{ \'/css/normalize.css\' | relative_url }}">');
    const themeScriptIndex = layout.indexOf("window.__waiApplyInitialTheme");

    assert.notEqual(themeScriptIndex, -1);
    assert.ok(themeScriptIndex < stylesheetIndex);
    assert.match(layout, /localStorage\.getItem\("themePreference"\)/);
    assert.match(layout, /document\.documentElement\.dataset\.theme = preference/);
    assert.match(layout, /document\.documentElement\.style\.colorScheme = preference/);
    assert.match(layout, /<meta name="theme-color" content="#f7f9fb">/);
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
});
