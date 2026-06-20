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

function declarationMap(block) {
  return Object.fromEntries(
    [...block.matchAll(/([a-z-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}

function allRules(source = css) {
  return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selectors: match[1]
      .split(",")
      .map((selector) => selector.trim())
      .filter((selector) => selector && !selector.startsWith("@")),
    declarations: declarationMap(match[2]),
  }));
}

function declarationsFor(matchingSelectors) {
  return allRules().reduce((declarations, rule) => {
    if (matchingSelectors.some((selector) => rule.selectors.includes(selector))) {
      return { ...declarations, ...rule.declarations };
    }

    return declarations;
  }, {});
}

function normalizeHex(value) {
  const normalized = value.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(normalized)) {
    return `#${[...normalized.slice(1)].map((digit) => `${digit}${digit}`).join("")}`;
  }

  return normalized;
}

function normalizeDeclarationValue(value) {
  return value.replace(/\s*!important$/, "").trim();
}

function resolveColor(value, variables) {
  const normalized = normalizeDeclarationValue(value);
  const variableMatch = normalized.match(/^var\((--wai-[a-z-]+)\)$/);
  if (variableMatch) {
    assert.ok(variables[variableMatch[1]], `${variableMatch[1]} resolves to a color token`);
    return variables[variableMatch[1]];
  }

  assert.match(normalized, /^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/, `${value} is a hex color`);
  return normalizeHex(normalized);
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

function assertContrast(foreground, background, name, paletteName, role) {
  assert.ok(
    contrast(foreground, background) >= 4.5,
    `${name} ${role} should meet 4.5:1 contrast in ${paletteName} mode (${foreground} on ${background})`,
  );
}

function resolvedBackgrounds(declarations, variables, backgroundTokens) {
  const background = declarations.background ?? declarations["background-color"];
  if (!background || normalizeDeclarationValue(background) === "transparent") {
    return backgroundTokens.map((token) => variables[token]);
  }

  return [resolveColor(background, variables)];
}

function assertResolvedPairings(state, variables, paletteName) {
  const declarations = declarationsFor(state.selectors);
  assert.ok(declarations.color, `${state.name} has a resolved foreground color`);

  const backgrounds = resolvedBackgrounds(
    declarations,
    variables,
    state.backgroundTokens ?? ["--wai-bg", "--wai-surface", "--wai-surface-strong"],
  );
  const foreground = resolveColor(declarations.color, variables);

  for (const background of backgrounds) {
    assertContrast(foreground, background, state.name, paletteName, "foreground");
  }

  if (state.checkBorder) {
    assert.ok(declarations["border-color"], `${state.name} has a resolved border color`);
    const border = resolveColor(declarations["border-color"], variables);

    for (const background of backgrounds) {
      assertContrast(border, background, state.name, paletteName, "border");
    }
  }

  if (state.checkDecoration) {
    assert.ok(declarations["text-decoration-color"], `${state.name} has a resolved underline color`);
    const decoration = resolveColor(declarations["text-decoration-color"], variables);

    for (const background of backgrounds) {
      assertContrast(decoration, background, state.name, paletteName, "underline");
    }
  }
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
    assert.equal(darkVars["--wai-code"], "#f0a7cd");
    assert.equal(darkVars["--wai-copper"], "#d6a05d");
    assert.equal(darkVars["--wai-focus"], "#f1b86d");
    assert.equal(darkVars["--wai-selection-bg"], "#294b63");
    assert.equal(darkVars["--wai-selection-ink"], "#f7fbff");
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
      darkVars["--wai-code"],
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

  it("keeps inline code and text selection at AA contrast", () => {
    const palettes = {
      light: variablesFrom(blockFor(":root")),
      dark: variablesFrom(blockFor(':root[data-theme="dark"]')),
    };
    const codeBlock = blockFor("code");
    const selectionBlock = blockFor("::selection");
    const mozSelectionBlock = blockFor("::-moz-selection");

    assertDeclaration(blockFor(":root"), "--bs-border-color", "var(--wai-line)");
    assertDeclaration(blockFor(":root"), "--bs-code-color", "var(--wai-code)");
    assertDeclaration(blockFor(':root[data-theme="dark"]'), "--bs-border-color", "var(--wai-line)");
    assertDeclaration(blockFor(':root[data-theme="dark"]'), "--bs-code-color", "var(--wai-code)");
    assertDeclaration(codeBlock, "color", "var(--wai-code)");
    assertDeclaration(selectionBlock, "background", "var(--wai-selection-bg)");
    assertDeclaration(selectionBlock, "color", "var(--wai-selection-ink)");
    assertDeclaration(mozSelectionBlock, "background", "var(--wai-selection-bg)");
    assertDeclaration(mozSelectionBlock, "color", "var(--wai-selection-ink)");

    for (const [paletteName, variables] of Object.entries(palettes)) {
      const backgrounds = [variables["--wai-bg"], variables["--wai-surface"], variables["--wai-surface-strong"]];
      for (const background of backgrounds) {
        assertContrast(variables["--wai-code"], background, "code", paletteName, "foreground");
      }
      assertContrast(
        variables["--wai-selection-ink"],
        variables["--wai-selection-bg"],
        "::selection",
        paletteName,
        "foreground",
      );
    }
  });

  it("keeps button foregrounds at AA contrast in light and dark palettes", () => {
    const palettes = {
      light: variablesFrom(blockFor(":root")),
      dark: variablesFrom(blockFor(':root[data-theme="dark"]')),
    };
    const buttonStates = [
      {
        name: ".btn-primary",
        selectors: [".btn-primary"],
        defaultForeground: "#fff",
      },
      {
        name: ".btn-primary:hover",
        selectors: [".btn-primary", ".btn-primary:hover"],
        defaultForeground: "#fff",
      },
      {
        name: ".btn-primary:focus",
        selectors: [".btn-primary", ".btn-primary:focus"],
        defaultForeground: "#fff",
      },
      {
        name: ".btn-outline-primary:hover",
        selectors: [".btn-outline-primary", ".btn-outline-primary:hover"],
      },
      {
        name: ".btn-outline-primary:focus",
        selectors: [".btn-outline-primary", ".btn-outline-primary:focus"],
      },
    ];

    for (const [paletteName, variables] of Object.entries(palettes)) {
      for (const state of buttonStates) {
        const declarations = declarationsFor(state.selectors);
        const foreground = resolveColor(declarations.color ?? state.defaultForeground, variables);
        const background = resolveColor(declarations.background ?? declarations["background-color"], variables);

        assert.ok(
          contrast(foreground, background) >= 4.5,
          `${state.name} should meet 4.5:1 contrast in ${paletteName} mode (${foreground} on ${background})`,
        );
      }
    }
  });

  it("keeps Bootstrap secondary utilities at AA contrast in light and dark palettes", () => {
    const palettes = {
      light: variablesFrom(blockFor(":root")),
      dark: variablesFrom(blockFor(':root[data-theme="dark"]')),
    };
    const secondaryStates = [
      {
        name: ".text-muted",
        selectors: [".text-muted"],
      },
      {
        name: ".link-secondary",
        selectors: [".link-secondary"],
        checkDecoration: true,
      },
      {
        name: ".link-secondary:hover",
        selectors: [".link-secondary", ".link-secondary:hover"],
        checkDecoration: true,
      },
      {
        name: ".link-secondary:focus",
        selectors: [".link-secondary", ".link-secondary:focus"],
        checkDecoration: true,
      },
      {
        name: ".btn-outline-secondary",
        selectors: [".btn-outline-secondary"],
        checkBorder: true,
      },
      {
        name: ".btn-outline-secondary:hover",
        selectors: [".btn-outline-secondary", ".btn-outline-secondary:hover"],
        checkBorder: true,
      },
      {
        name: ".btn-outline-secondary:focus",
        selectors: [".btn-outline-secondary", ".btn-outline-secondary:focus"],
        checkBorder: true,
      },
      {
        name: ".btn-outline-secondary:active",
        selectors: [".btn-outline-secondary", ".btn-outline-secondary:active"],
      },
    ];

    for (const [paletteName, variables] of Object.entries(palettes)) {
      for (const state of secondaryStates) {
        assertResolvedPairings(state, variables, paletteName);
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
