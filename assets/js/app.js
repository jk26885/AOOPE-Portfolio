/**
 * app.js — Advanced OOP E-Portfolio
 * Handles dark/light theme toggling and persistence.
 *
 * Theme state lives on <html data-theme="dark|light"> and is read by
 * assets/css/dark.css. Preference is remembered in localStorage so it
 * survives navigation between pages and repeat visits.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "aoop-eportfolio-theme";
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage unavailable (e.g. privacy mode) — fall back silently.
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  function prefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀ Light mode" : "● Dark mode";
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || (prefersDark() ? "dark" : "light");
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  }

  // Apply theme as early as possible to avoid a flash of the wrong theme.
  initTheme();

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }
    // Re-apply once DOM is ready so the button label matches current state.
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current);
  });
})();
