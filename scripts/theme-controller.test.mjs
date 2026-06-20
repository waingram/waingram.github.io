import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import vm from "node:vm";

function createClassList() {
  const values = new Set();
  return {
    add(value) {
      values.add(value);
    },
    remove(value) {
      values.delete(value);
    },
    contains(value) {
      return values.has(value);
    },
  };
}

function createElement(dataset = {}) {
  const listeners = {};
  return {
    attrs: {},
    classList: createClassList(),
    dataset: { ...dataset },
    hidden: false,
    textContent: "",
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    click() {
      listeners.click?.({ target: this });
    },
    contains(node) {
      return node === this;
    },
    getAttribute(name) {
      return this.attrs[name];
    },
    removeAttribute(name) {
      delete this.attrs[name];
    },
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    },
  };
}

function createDocument() {
  const documentElement = {
    attrs: {},
    dataset: {},
    style: {},
    removeAttribute(name) {
      delete this.attrs[name];
      if (name === "data-theme") delete this.dataset.theme;
    },
    setAttribute(name, value) {
      this.attrs[name] = String(value);
      if (name === "data-theme") this.dataset.theme = String(value);
    },
  };

  const toggle = createElement();
  const label = createElement();
  const menu = createElement();
  menu.hidden = true;
  const themeColor = { content: "#f7f9fb" };
  const icons = ["system", "light", "dark"].map((theme) => createElement({ themeIcon: theme }));
  const choices = ["system", "light", "dark"].map((theme) => createElement({ themeChoice: theme }));
  const documentListeners = {};

  return {
    choices,
    documentElement,
    icons,
    label,
    menu,
    themeColor,
    toggle,
    addEventListener(type, handler) {
      documentListeners[type] = handler;
    },
    dispatch(type, event) {
      documentListeners[type]?.(event);
    },
    querySelector(selector) {
      if (selector === "[data-theme-toggle]") return toggle;
      if (selector === "[data-theme-toggle-label]") return label;
      if (selector === "[data-theme-menu]") return menu;
      if (selector === 'meta[name="theme-color"]') return themeColor;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === "[data-theme-choice]") return choices;
      if (selector === "[data-theme-icon]") return icons;
      return [];
    },
  };
}

function createStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

function createMediaQueryList(matches = false) {
  const listeners = new Set();
  return {
    matches,
    addEventListener(type, listener) {
      if (type === "change") listeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "change") listeners.delete(listener);
    },
    change(nextMatches) {
      this.matches = nextMatches;
      for (const listener of listeners) listener({ matches: nextMatches });
    },
  };
}

function loadTheme({ darkMatches = false, storageData = {} } = {}) {
  const document = createDocument();
  const storage = createStorage(storageData);
  const mediaQueryList = createMediaQueryList(darkMatches);
  const window = {
    document,
    localStorage: storage,
    matchMedia(query) {
      assert.equal(query, "(prefers-color-scheme: dark)");
      return mediaQueryList;
    },
  };
  const sandbox = {
    document,
    localStorage: storage,
    window,
  };

  const source = fs.readFileSync(new URL("../js/main.js", import.meta.url), "utf8");
  vm.runInNewContext(source, sandbox, { filename: "js/main.js" });

  assert.equal(typeof window.WAITheme?.initThemeController, "function");
  assert.equal(typeof window.WAITheme?.getEffectiveTheme, "function");
  return { api: window.WAITheme, document, mediaQueryList, storage, window };
}

describe("theme controller", () => {
  it("defaults to system and resolves to light when dark is not matched", () => {
    const { api, window } = loadTheme();

    assert.equal(api.readStoredPreference(window.localStorage), "system");
    assert.equal(api.getEffectiveTheme("system", window), "light");
  });

  it("resolves system to dark when the OS preference is dark", () => {
    const { api, window } = loadTheme({ darkMatches: true });

    assert.equal(api.getEffectiveTheme("system", window), "dark");
  });

  it("applies saved explicit preferences to the root", () => {
    const { api, document, window } = loadTheme({ storageData: { themePreference: "dark" } });

    api.initThemeController({ document, window, storage: window.localStorage });

    assert.equal(document.documentElement.dataset.theme, "dark");
    assert.equal(document.themeColor.content, "#0d151d");
    assert.equal(document.label.textContent, "Theme: Dark");
  });

  it("clears invalid stored values and returns to system", () => {
    const { api, storage } = loadTheme({ storageData: { themePreference: "sepia" } });

    assert.equal(api.readStoredPreference(storage), "system");
    assert.equal(storage.getItem("themePreference"), null);
  });

  it("selecting system clears the explicit override", () => {
    const { api, document, storage, window } = loadTheme({ storageData: { themePreference: "dark" } });
    api.initThemeController({ document, window, storage });

    document.choices.find((choice) => choice.dataset.themeChoice === "system").click();

    assert.equal(storage.getItem("themePreference"), null);
    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.label.textContent, "Theme: System");
  });

  it("updates selected menu state when choosing light", () => {
    const { api, document, storage, window } = loadTheme({ darkMatches: true });
    api.initThemeController({ document, window, storage });

    document.choices.find((choice) => choice.dataset.themeChoice === "light").click();

    const light = document.choices.find((choice) => choice.dataset.themeChoice === "light");
    const dark = document.choices.find((choice) => choice.dataset.themeChoice === "dark");
    assert.equal(storage.getItem("themePreference"), "light");
    assert.equal(document.documentElement.dataset.theme, "light");
    assert.equal(light.getAttribute("aria-checked"), "true");
    assert.equal(dark.getAttribute("aria-checked"), "false");
  });

  it("updates system mode when the OS preference changes", () => {
    const { api, document, mediaQueryList, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    mediaQueryList.change(true);

    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.themeColor.content, "#0d151d");
  });

  it("closes the menu with Escape and outside clicks", () => {
    const { api, document, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    document.toggle.click();
    assert.equal(document.menu.hidden, false);
    assert.equal(document.toggle.getAttribute("aria-expanded"), "true");

    document.dispatch("keydown", { key: "Escape" });
    assert.equal(document.menu.hidden, true);

    document.toggle.click();
    document.dispatch("click", { target: createElement() });
    assert.equal(document.menu.hidden, true);
  });
});
