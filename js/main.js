(function (windowObject) {
  "use strict";

  if (!windowObject) return;

  const STORAGE_KEY = "themePreference";
  const SYSTEM = "system";
  const LIGHT = "light";
  const DARK = "dark";
  const EXPLICIT_THEMES = new Set([LIGHT, DARK]);
  const VALID_PREFERENCES = new Set([SYSTEM, LIGHT, DARK]);
  const THEME_COLORS = {
    [LIGHT]: "#f7f9fb",
    [DARK]: "#0d151d",
  };

  function getPreferenceLabel(preference) {
    return `Theme: ${preference.charAt(0).toUpperCase()}${preference.slice(1)}`;
  }

  function getStorageValue(storage) {
    try {
      return storage?.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  function removeStorageValue(storage) {
    try {
      storage?.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private or restricted browsing contexts.
    }
  }

  function setStorageValue(storage, preference) {
    try {
      storage?.setItem(STORAGE_KEY, preference);
    } catch {
      // Keep the UI usable even if persistence is unavailable.
    }
  }

  function getWindowStorage(targetWindow = windowObject) {
    try {
      return targetWindow?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  function readStoredPreference(storage) {
    const storedPreference = getStorageValue(storage ?? getWindowStorage());

    if (!storedPreference) return SYSTEM;
    if (VALID_PREFERENCES.has(storedPreference)) return storedPreference;

    removeStorageValue(storage);
    return SYSTEM;
  }

  function getEffectiveTheme(preference = SYSTEM, targetWindow = windowObject) {
    if (EXPLICIT_THEMES.has(preference)) return preference;

    try {
      return targetWindow?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? DARK : LIGHT;
    } catch {
      return LIGHT;
    }
  }

  function setThemeColor(themeColor, color) {
    if (!themeColor) return;

    themeColor.content = color;
    themeColor.setAttribute?.("content", color);
  }

  function setExpanded(toggle, expanded) {
    toggle?.setAttribute?.("aria-expanded", expanded ? "true" : "false");
  }

  function applyTheme(
    preference = SYSTEM,
    {
      document = windowObject.document,
      window = windowObject,
    } = {},
  ) {
    const normalizedPreference = VALID_PREFERENCES.has(preference) ? preference : SYSTEM;
    const effectiveTheme = getEffectiveTheme(normalizedPreference, window);
    const root = document?.documentElement;

    if (root) {
      if (EXPLICIT_THEMES.has(normalizedPreference)) {
        root.setAttribute("data-theme", normalizedPreference);
      } else {
        root.removeAttribute("data-theme");
      }

      if (root.style) root.style.colorScheme = effectiveTheme;
    }

    setThemeColor(document?.querySelector?.('meta[name="theme-color"]'), THEME_COLORS[effectiveTheme]);

    const label = document?.querySelector?.("[data-theme-toggle-label]");
    if (label) label.textContent = getPreferenceLabel(normalizedPreference);

    const toggle = document?.querySelector?.("[data-theme-toggle]");
    if (toggle) {
      toggle.dataset.themePreference = normalizedPreference;
      toggle.dataset.effectiveTheme = effectiveTheme;
      toggle.setAttribute?.("aria-label", getPreferenceLabel(normalizedPreference));
    }

    for (const icon of document?.querySelectorAll?.("[data-theme-icon]") ?? []) {
      icon.hidden = icon.dataset?.themeIcon !== normalizedPreference;
    }

    for (const choice of document?.querySelectorAll?.("[data-theme-choice]") ?? []) {
      const selected = choice.dataset?.themeChoice === normalizedPreference;
      choice.setAttribute?.("aria-checked", selected ? "true" : "false");
      choice.classList?.[selected ? "add" : "remove"]?.("is-selected");
    }

    return effectiveTheme;
  }

  function initThemeController({
    document = windowObject.document,
    window = windowObject,
    storage,
  } = {}) {
    const toggle = document?.querySelector?.("[data-theme-toggle]");
    const menu = document?.querySelector?.("[data-theme-menu]");
    const choices = Array.from(document?.querySelectorAll?.("[data-theme-choice]") ?? []);
    const mediaQueryList = window?.matchMedia?.("(prefers-color-scheme: dark)");
    const resolvedStorage = storage ?? getWindowStorage(window);
    let preference = readStoredPreference(resolvedStorage);

    function closeMenu() {
      if (menu) menu.hidden = true;
      setExpanded(toggle, false);
    }

    function toggleMenu() {
      if (!menu) return;

      menu.hidden = !menu.hidden;
      setExpanded(toggle, !menu.hidden);
    }

    function selectPreference(nextPreference) {
      if (!VALID_PREFERENCES.has(nextPreference)) return;

      preference = nextPreference;
      if (nextPreference === SYSTEM) {
        removeStorageValue(resolvedStorage);
      } else {
        setStorageValue(resolvedStorage, nextPreference);
      }

      applyTheme(preference, { document, window });
      closeMenu();
    }

    applyTheme(preference, { document, window });
    closeMenu();

    toggle?.addEventListener?.("click", toggleMenu);

    for (const choice of choices) {
      choice.addEventListener?.("click", () => {
        selectPreference(choice.dataset?.themeChoice);
      });
    }

    document?.addEventListener?.("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document?.addEventListener?.("click", (event) => {
      const target = event.target;
      if (toggle?.contains?.(target) || menu?.contains?.(target)) return;

      closeMenu();
    });

    const handleMediaQueryChange = () => {
      if (preference === SYSTEM) applyTheme(preference, { document, window });
    };
    if (mediaQueryList?.addEventListener) {
      mediaQueryList.addEventListener("change", handleMediaQueryChange);
    } else {
      mediaQueryList?.addListener?.(handleMediaQueryChange);
    }

    return {
      applyTheme(nextPreference = preference) {
        preference = VALID_PREFERENCES.has(nextPreference) ? nextPreference : SYSTEM;
        return applyTheme(preference, { document, window });
      },
      closeMenu,
      selectPreference,
    };
  }

  windowObject.WAITheme = {
    ...(windowObject.WAITheme ?? {}),
    applyTheme,
    getEffectiveTheme,
    initThemeController,
    readStoredPreference,
  };

  function initThemeControllerWhenReady() {
    const document = windowObject.document;
    if (!document) return;

    const start = () => {
      initThemeController({
        document,
        window: windowObject,
        storage: getWindowStorage(windowObject),
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener?.("DOMContentLoaded", start, { once: true });
      return;
    }

    start();
  }

  initThemeControllerWhenReady();
})(typeof window !== "undefined" ? window : globalThis);
