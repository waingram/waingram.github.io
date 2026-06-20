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

function createElement(dataset = {}, { focusElement } = {}) {
  const listeners = {};
  return {
    attrs: {},
    classList: createClassList(),
    dataset: { ...dataset },
    hidden: false,
    textContent: "",
    addEventListener(type, handler) {
      listeners[type] ??= [];
      listeners[type].push(handler);
    },
    click() {
      this.dispatch("click", { target: this });
    },
    contains(node) {
      return node === this;
    },
    dispatch(type, event = {}) {
      const eventObject = { target: this, ...event };
      for (const handler of listeners[type] ?? []) handler(eventObject);
      return eventObject;
    },
    focus() {
      focusElement?.(this);
    },
    getAttribute(name) {
      return this.attrs[name];
    },
    hasAttribute(name) {
      return Object.hasOwn(this.attrs, name);
    },
    keydown(key, event = {}) {
      const eventObject = {
        key,
        target: this,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
        ...event,
      };
      this.dispatch("keydown", eventObject);
      return eventObject;
    },
    removeAttribute(name) {
      delete this.attrs[name];
    },
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    },
    toggleAttribute(name, force) {
      const shouldSet = force ?? !this.hasAttribute(name);
      if (shouldSet) {
        this.setAttribute(name, "");
        return true;
      }

      this.removeAttribute(name);
      return false;
    },
  };
}

function createDocument({ missingThemeMarkup = false, readyState = "loading" } = {}) {
  const state = { activeElement: null };
  const focusOptions = {
    focusElement(element) {
      state.activeElement = element;
    },
  };
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

  const toggle = createElement({}, focusOptions);
  const label = createElement({}, focusOptions);
  const menu = createElement({}, focusOptions);
  menu.hidden = true;
  const themeColor = { content: "#f7f9fb" };
  const icons = ["system", "light", "dark"].map((theme) => createElement({ themeIcon: theme }, focusOptions));
  const choices = ["system", "light", "dark"].map((theme) => createElement({ themeChoice: theme }, focusOptions));
  const documentListeners = {};

  return {
    choices,
    documentElement,
    icons,
    label,
    menu,
    readyState,
    themeColor,
    toggle,
    get activeElement() {
      return state.activeElement;
    },
    addEventListener(type, handler) {
      documentListeners[type] ??= [];
      documentListeners[type].push(handler);
    },
    dispatch(type, event) {
      for (const handler of documentListeners[type] ?? []) handler(event);
    },
    listenerCount(type) {
      return documentListeners[type]?.length ?? 0;
    },
    querySelector(selector) {
      if (missingThemeMarkup) return null;
      if (selector === "[data-theme-toggle]") return toggle;
      if (selector === "[data-theme-toggle-label]") return label;
      if (selector === "[data-theme-menu]") return menu;
      if (selector === 'meta[name="theme-color"]') return themeColor;
      return null;
    },
    querySelectorAll(selector) {
      if (missingThemeMarkup) return [];
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

function createLegacyMediaQueryList(matches = false) {
  const listeners = new Set();
  return {
    matches,
    addListener(listener) {
      listeners.add(listener);
    },
    change(nextMatches) {
      this.matches = nextMatches;
      for (const listener of listeners) listener({ matches: nextMatches });
    },
  };
}

function loadTheme({
  darkMatches = false,
  legacyMediaQuery = false,
  missingThemeMarkup = false,
  readyState = "loading",
  storageData = {},
  storageThrows = false,
} = {}) {
  const document = createDocument({ missingThemeMarkup, readyState });
  const storage = createStorage(storageData);
  const mediaQueryList = legacyMediaQuery
    ? createLegacyMediaQueryList(darkMatches)
    : createMediaQueryList(darkMatches);
  const window = {
    document,
    matchMedia(query) {
      assert.equal(query, "(prefers-color-scheme: dark)");
      return mediaQueryList;
    },
  };
  if (storageThrows) {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("localStorage blocked");
      },
    });
  } else {
    window.localStorage = storage;
  }
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
    assert.equal(document.toggle.dataset.themePreference, "dark");
    assert.equal(document.toggle.dataset.effectiveTheme, "dark");
    assert.equal(document.toggle.getAttribute("aria-label"), "Theme: Dark");
  });

  it("updates trigger state for the initial system preference", () => {
    const { api, document, storage, window } = loadTheme();

    api.initThemeController({ document, window, storage });

    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "light");
    assert.equal(document.toggle.getAttribute("aria-label"), "Theme: System");
  });

  it("updates SVG icon hidden attributes for the selected preference", () => {
    const { api, document, storage, window } = loadTheme({ storageData: { themePreference: "dark" } });
    api.initThemeController({ document, window, storage });

    const system = document.icons.find((icon) => icon.dataset.themeIcon === "system");
    const light = document.icons.find((icon) => icon.dataset.themeIcon === "light");
    const dark = document.icons.find((icon) => icon.dataset.themeIcon === "dark");

    assert.equal(system.hasAttribute("hidden"), true);
    assert.equal(light.hasAttribute("hidden"), true);
    assert.equal(dark.hasAttribute("hidden"), false);

    document.choices.find((choice) => choice.dataset.themeChoice === "system").click();

    assert.equal(system.hasAttribute("hidden"), false);
    assert.equal(light.hasAttribute("hidden"), true);
    assert.equal(dark.hasAttribute("hidden"), true);
  });

  it("clears invalid stored values and returns to system", () => {
    const { api, storage } = loadTheme({ storageData: { themePreference: "sepia" } });

    assert.equal(api.readStoredPreference(storage), "system");
    assert.equal(storage.getItem("themePreference"), null);
  });

  it("clears invalid stored values from default storage", () => {
    const { api, storage } = loadTheme({ storageData: { themePreference: "sepia" } });

    assert.equal(api.readStoredPreference(), "system");
    assert.equal(storage.getItem("themePreference"), null);
  });

  it("selecting system clears the explicit override", () => {
    const { api, document, storage, window } = loadTheme({ storageData: { themePreference: "dark" } });
    api.initThemeController({ document, window, storage });

    document.choices.find((choice) => choice.dataset.themeChoice === "system").click();

    assert.equal(storage.getItem("themePreference"), null);
    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.label.textContent, "Theme: System");
    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "light");
    assert.equal(document.toggle.getAttribute("aria-label"), "Theme: System");
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
    assert.equal(document.toggle.dataset.themePreference, "light");
    assert.equal(document.toggle.dataset.effectiveTheme, "light");
    assert.equal(document.toggle.getAttribute("aria-label"), "Theme: Light");
  });

  it("updates system mode when the OS preference changes", () => {
    const { api, document, mediaQueryList, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    mediaQueryList.change(true);

    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.themeColor.content, "#0d151d");
    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "dark");
  });

  it("updates system mode through the legacy media query listener", () => {
    const { api, document, mediaQueryList, storage, window } = loadTheme({ legacyMediaQuery: true });
    api.initThemeController({ document, window, storage });

    mediaQueryList.change(true);

    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.themeColor.content, "#0d151d");
    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "dark");
  });

  it("keeps explicit preferences across system media changes", () => {
    for (const preference of ["light", "dark"]) {
      const { api, document, mediaQueryList, storage, window } = loadTheme({
        darkMatches: preference === "dark",
        storageData: { themePreference: preference },
      });
      api.initThemeController({ document, window, storage });

      mediaQueryList.change(preference === "light");

      assert.equal(document.documentElement.dataset.theme, preference);
      assert.equal(document.documentElement.style.colorScheme, preference);
      assert.equal(document.themeColor.content, preference === "dark" ? "#0d151d" : "#f7f9fb");
      assert.equal(document.toggle.dataset.themePreference, preference);
      assert.equal(document.toggle.dataset.effectiveTheme, preference);
    }
  });

  it("tolerates missing optional theme markup", () => {
    const { api, document, storage, window } = loadTheme({ missingThemeMarkup: true });

    assert.doesNotThrow(() => {
      api.initThemeController({ document, window, storage });
    });
    assert.doesNotThrow(() => {
      api.applyTheme("dark", { document, window });
    });
  });

  it("tolerates blocked localStorage and initializes with system fallback", () => {
    const { api, document, window } = loadTheme({ storageThrows: true });

    assert.doesNotThrow(() => {
      api.initThemeController({ document, window });
    });
    assert.equal(document.documentElement.dataset.theme, undefined);
    assert.equal(document.documentElement.style.colorScheme, "light");
    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "light");
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

  it("focuses the selected theme when the menu opens", () => {
    const { api, document, storage, window } = loadTheme({ storageData: { themePreference: "dark" } });
    api.initThemeController({ document, window, storage });

    document.toggle.click();

    assert.equal(document.menu.hidden, false);
    assert.equal(document.activeElement.dataset.themeChoice, "dark");
  });

  it("moves focus through open menu choices with arrows, Home, and End", () => {
    const { api, document, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    document.toggle.click();
    assert.equal(document.activeElement.dataset.themeChoice, "system");

    document.activeElement.keydown("ArrowRight");
    assert.equal(document.activeElement.dataset.themeChoice, "light");

    document.activeElement.keydown("ArrowDown");
    assert.equal(document.activeElement.dataset.themeChoice, "dark");

    document.activeElement.keydown("ArrowDown");
    assert.equal(document.activeElement.dataset.themeChoice, "system");

    document.activeElement.keydown("ArrowLeft");
    assert.equal(document.activeElement.dataset.themeChoice, "dark");

    document.activeElement.keydown("ArrowUp");
    assert.equal(document.activeElement.dataset.themeChoice, "light");

    document.activeElement.keydown("Home");
    assert.equal(document.activeElement.dataset.themeChoice, "system");

    document.activeElement.keydown("End");
    assert.equal(document.activeElement.dataset.themeChoice, "dark");
  });

  it("opens the closed trigger to first or last menu choice with arrow keys", () => {
    const { api, document, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    document.toggle.keydown("ArrowDown");

    assert.equal(document.menu.hidden, false);
    assert.equal(document.toggle.getAttribute("aria-expanded"), "true");
    assert.equal(document.activeElement.dataset.themeChoice, "system");

    document.dispatch("keydown", { key: "Escape" });
    document.toggle.keydown("ArrowUp");

    assert.equal(document.menu.hidden, false);
    assert.equal(document.activeElement.dataset.themeChoice, "dark");
  });

  it("selects focused menu choices with Enter and Space then restores trigger focus", () => {
    for (const [key, expectedTheme] of [
      ["Enter", "light"],
      [" ", "dark"],
    ]) {
      const { api, document, storage, window } = loadTheme();
      api.initThemeController({ document, window, storage });

      document.toggle.click();
      document.choices.find((choice) => choice.dataset.themeChoice === expectedTheme).focus();
      document.activeElement.keydown(key);

      assert.equal(storage.getItem("themePreference"), expectedTheme);
      assert.equal(document.menu.hidden, true);
      assert.equal(document.toggle.getAttribute("aria-expanded"), "false");
      assert.equal(document.activeElement, document.toggle);
    }
  });

  it("closes with Escape and restores trigger focus when focus is in the menu", () => {
    const { api, document, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    document.toggle.click();
    document.choices.find((choice) => choice.dataset.themeChoice === "light").focus();
    document.dispatch("keydown", { key: "Escape" });

    assert.equal(document.menu.hidden, true);
    assert.equal(document.toggle.getAttribute("aria-expanded"), "false");
    assert.equal(document.activeElement, document.toggle);
  });

  it("restores trigger focus after selecting an open choice with click", () => {
    const { api, document, storage, window } = loadTheme();
    api.initThemeController({ document, window, storage });

    document.toggle.click();
    document.choices.find((choice) => choice.dataset.themeChoice === "dark").click();

    assert.equal(storage.getItem("themePreference"), "dark");
    assert.equal(document.menu.hidden, true);
    assert.equal(document.activeElement, document.toggle);
  });

  it("registers DOMContentLoaded initialization while the document is loading", () => {
    const { document } = loadTheme({ readyState: "loading" });

    assert.equal(document.listenerCount("DOMContentLoaded"), 1);
    assert.equal(document.label.textContent, "");

    document.dispatch("DOMContentLoaded", {});

    assert.equal(document.label.textContent, "Theme: System");
    assert.equal(document.toggle.dataset.themePreference, "system");
    assert.equal(document.toggle.dataset.effectiveTheme, "light");
  });

  it("initializes immediately when the document is already ready", () => {
    const { document } = loadTheme({ readyState: "interactive", storageData: { themePreference: "dark" } });

    assert.equal(document.documentElement.dataset.theme, "dark");
    assert.equal(document.label.textContent, "Theme: Dark");
    assert.equal(document.toggle.dataset.themePreference, "dark");
    assert.equal(document.toggle.dataset.effectiveTheme, "dark");
    assert.equal(document.toggle.getAttribute("aria-expanded"), "false");
  });
});
