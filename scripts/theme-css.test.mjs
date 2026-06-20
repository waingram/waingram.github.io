import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

const css = fs.readFileSync(new URL("../css/main.css", import.meta.url), "utf8");

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

function assertDeclaration(block, property, value) {
  assert.match(block, new RegExp(`${escapeRegExp(property)}:\\s*${escapeRegExp(value)};`));
}

function variablesFrom(block) {
  return Object.fromEntries(
    [...block.matchAll(/(--wai-[a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [match[1], match[2].toLowerCase()]),
  );
}

function srgbToLinear(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const value = hex.replace("#", "");
  const red = srgbToLinear(parseInt(value.slice(0, 2), 16));
  const green = srgbToLinear(parseInt(value.slice(2, 4), 16));
  const blue = srgbToLinear(parseInt(value.slice(4, 6), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe("theme CSS", () => {
  it("defines explicit dark tokens and system dark behavior", () => {
    assert.match(css, /@media\s*\(prefers-color-scheme:\s*dark\)/);
    assert.match(css, /:root:not\(\[data-theme="light"\]\)/);

    const darkVars = variablesFrom(blockFor(':root[data-theme="dark"]'));
    assert.equal(darkVars["--wai-bg"], "#0d151d");
    assert.equal(darkVars["--wai-surface"], "#131f2a");
    assert.equal(darkVars["--wai-surface-strong"], "#1a2a37");
    assert.equal(darkVars["--wai-ink"], "#edf4f8");
    assert.equal(darkVars["--wai-muted"], "#b8c8d5");
    assert.equal(darkVars["--wai-soft"], "#8ea4b5");
    assert.equal(darkVars["--wai-blue"], "#76c7ef");
    assert.equal(darkVars["--wai-blue-dark"], "#a7dcf6");
    assert.equal(darkVars["--wai-copper"], "#d6a05d");
    assert.equal(darkVars["--wai-focus"], "#f1b86d");
  });

  it("keeps planned dark theme text colors at AA contrast", () => {
    const darkVars = variablesFrom(blockFor(':root[data-theme="dark"]'));
    const backgrounds = [darkVars["--wai-bg"], darkVars["--wai-surface"], darkVars["--wai-surface-strong"]];
    const foregrounds = [
      darkVars["--wai-ink"],
      darkVars["--wai-muted"],
      darkVars["--wai-soft"],
      darkVars["--wai-blue"],
      darkVars["--wai-blue-dark"],
      darkVars["--wai-copper"],
      darkVars["--wai-focus"],
      darkVars["--wai-lead"],
      darkVars["--wai-profile-meta"],
    ];

    for (const background of backgrounds) {
      for (const foreground of foregrounds) {
        assert.ok(
          contrast(foreground, background) >= 4.5,
          `${foreground} on ${background} should meet 4.5:1 contrast`,
        );
      }
    }
  });

  it("styles the compact theme menu without layout shifts", () => {
    assert.match(css, /\.theme-switcher/);
    assert.match(css, /\.theme-toggle/);
    assert.match(css, /\.theme-menu/);
    assert.match(css, /\.theme-menu-item/);
    assert.match(css, /\.theme-menu-item\[aria-checked="true"\]/);
    assert.match(css, /@media \(max-width: 767\.98px\)[\s\S]*\.theme-switcher/);

    const menuBlock = blockFor(".theme-menu");
    assertDeclaration(menuBlock, "position", "absolute");
    assertDeclaration(menuBlock, "top", "calc(100% + 0.45rem)");
    assertDeclaration(menuBlock, "z-index", "20");

    const mobileBlock = mediaBlockFor("(max-width: 767.98px)");
    assertDeclaration(blockFor(".theme-toggle", mobileBlock), "width", "100%");
    assertDeclaration(blockFor(".theme-menu", mobileBlock), "width", "100%");
  });
});
