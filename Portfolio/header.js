/* =========================================
   PORTFOLIO HEADER INTERACTIONS
   ========================================= */

(() => {
  "use strict";

  const toggle = document.getElementById("header-menu-toggle");
  const navigation = document.getElementById("header-navigation");

  if (!toggle || !navigation) {
    console.warn(
      "Header menu elements were not found. Check header.html."
    );
    return;
  }

  // Prevent duplicate event listeners.
  if (toggle.dataset.initialized === "true") {
    return;
  }

  toggle.dataset.initialized = "true";

  const mobileQuery = window.matchMedia("(max-width: 560px)");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
    navigation.classList.add("is-open");
  }

  // Toggle the mobile navigation.
  toggle.addEventListener("click", () => {
    const expanded =
      toggle.getAttribute("aria-expanded") === "true";

    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the mobile menu after clicking a navigation link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close the menu when switching to desktop layout.
  mobileQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });

  console.info("Header interactions initialized.");
})();