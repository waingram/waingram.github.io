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
    const resolvedStorage = storage ?? getWindowStorage();
    const storedPreference = getStorageValue(resolvedStorage);

    if (!storedPreference) return SYSTEM;
    if (VALID_PREFERENCES.has(storedPreference)) return storedPreference;

    removeStorageValue(resolvedStorage);
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
      const shouldHide = icon.dataset?.themeIcon !== normalizedPreference;
      if (icon.toggleAttribute) {
        icon.toggleAttribute("hidden", shouldHide);
      } else if (shouldHide) {
        icon.setAttribute?.("hidden", "");
      } else {
        icon.removeAttribute?.("hidden");
      }
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

    function isMenuOpen() {
      return Boolean(menu && !menu.hidden);
    }

    function focusChoice(index) {
      if (!choices.length) return;

      const normalizedIndex = (index + choices.length) % choices.length;
      choices[normalizedIndex]?.focus?.();
    }

    function focusSelectedChoice() {
      const selectedChoice =
        choices.find((choice) => choice.dataset?.themeChoice === preference) ??
        choices.find((choice) => choice.getAttribute?.("aria-checked") === "true") ??
        choices[0];

      selectedChoice?.focus?.();
    }

    function focusRelativeChoice(currentChoice, offset) {
      const currentIndex = choices.indexOf(currentChoice);
      focusChoice(currentIndex >= 0 ? currentIndex + offset : 0);
    }

    function menuContainsFocus() {
      const activeElement = document?.activeElement;
      return Boolean(
        activeElement &&
          (activeElement === toggle || choices.includes(activeElement) || menu?.contains?.(activeElement)),
      );
    }

    function closeMenu({ restoreFocus = false } = {}) {
      if (menu) menu.hidden = true;
      setExpanded(toggle, false);
      if (restoreFocus) toggle?.focus?.();
    }

    function openMenu({ focusIndex } = {}) {
      if (!menu) return;

      menu.hidden = false;
      setExpanded(toggle, true);

      if (typeof focusIndex === "number") {
        focusChoice(focusIndex);
      } else {
        focusSelectedChoice();
      }
    }

    function toggleMenu() {
      if (!menu) return;

      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function selectPreference(nextPreference, { restoreFocus = false } = {}) {
      if (!VALID_PREFERENCES.has(nextPreference)) return;

      preference = nextPreference;
      if (nextPreference === SYSTEM) {
        removeStorageValue(resolvedStorage);
      } else {
        setStorageValue(resolvedStorage, nextPreference);
      }

      applyTheme(preference, { document, window });
      closeMenu({ restoreFocus });
    }

    function handleToggleKeydown(event) {
      if (event.key === "ArrowDown") {
        event.preventDefault?.();
        openMenu({ focusIndex: 0 });
      } else if (event.key === "ArrowUp") {
        event.preventDefault?.();
        openMenu({ focusIndex: choices.length - 1 });
      }
    }

    function handleChoiceKeydown(event, choice) {
      if (!isMenuOpen()) return;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault?.();
          focusRelativeChoice(choice, 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault?.();
          focusRelativeChoice(choice, -1);
          break;
        case "Home":
          event.preventDefault?.();
          focusChoice(0);
          break;
        case "End":
          event.preventDefault?.();
          focusChoice(choices.length - 1);
          break;
        case "Enter":
        case " ":
        case "Spacebar":
          event.preventDefault?.();
          selectPreference(choice.dataset?.themeChoice, { restoreFocus: true });
          break;
        case "Escape":
          event.preventDefault?.();
          closeMenu({ restoreFocus: true });
          break;
      }
    }

    applyTheme(preference, { document, window });
    closeMenu();

    toggle?.addEventListener?.("click", toggleMenu);
    toggle?.addEventListener?.("keydown", handleToggleKeydown);

    for (const choice of choices) {
      choice.addEventListener?.("click", () => {
        selectPreference(choice.dataset?.themeChoice, { restoreFocus: true });
      });
      choice.addEventListener?.("keydown", (event) => {
        handleChoiceKeydown(event, choice);
      });
    }

    document?.addEventListener?.("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        event.preventDefault?.();
        closeMenu({ restoreFocus: menuContainsFocus() });
      }
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
