/**
 * search.js — Advanced OOP E-Portfolio
 *
 * Lightweight, dependency-free search that filters the sidebar navigation
 * links as the user types. No server or search index required — it just
 * matches against the visible link text (and an optional data-keywords
 * attribute for extra matchable terms not shown in the label).
 *
 * Usage: add <input id="nav-search-input" ...> inside the sidebar, above
 * <ul class="nav-links">. Each <li> may optionally carry
 * data-keywords="..." with extra search terms (e.g. pattern names).
 */

(function () {
  "use strict";

  function normalise(str) {
    return str.trim().toLowerCase();
  }

  function initSearch() {
    const input = document.getElementById("nav-search-input");
    const list = document.querySelector(".nav-links");
    if (!input || !list) return;

    const items = Array.from(list.querySelectorAll("li"));

    // Pre-compute searchable text once per item.
    const searchable = items.map(function (li) {
      const label = normalise(li.textContent || "");
      const extra = normalise(li.getAttribute("data-keywords") || "");
      return label + " " + extra;
    });

    input.addEventListener("input", function () {
      const query = normalise(input.value);

      if (!query) {
        items.forEach(function (li) {
          li.hidden = false;
        });
        return;
      }

      let anyVisible = false;
      items.forEach(function (li, i) {
        const match = searchable[i].indexOf(query) !== -1;
        li.hidden = !match;
        if (match) anyVisible = true;
      });

      // If nothing matches, show everything again rather than an empty
      // sidebar — avoids the search feeling "broken" on an odd query.
      if (!anyVisible) {
        items.forEach(function (li) {
          li.hidden = false;
        });
      }
    });

    // Escape clears the search and restores the full list.
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        items.forEach(function (li) {
          li.hidden = false;
        });
        input.blur();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initSearch);
})();
