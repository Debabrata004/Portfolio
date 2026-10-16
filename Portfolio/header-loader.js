/* =========================================
   SHARED HEADER LOADER
   Loads header.html, highlights the current page,
   and initializes header.js.
   ========================================= */

(async function loadHeader() {
  "use strict";

  const container = document.getElementById("site-header");

  if (!container) {
    console.error(
      'Header container "#site-header" was not found.'
    );
    return;
  }

  // Find the location of this script.
  const loaderScript = document.querySelector(
    'script[src*="header-loader.js"]'
  );

  const loaderBase = loaderScript
    ? loaderScript.src
    : document.baseURI;

  function normalizedPath(pathname) {
    if (pathname.endsWith("/")) {
      return `${pathname}index.html`;
    }

    return pathname;
  }

  try {
    // Resolve header.html relative to header-loader.js.
    const headerUrl = new URL(
      "header.html",
      loaderBase
    );

    // Prevent the browser from reusing a cached header.
    headerUrl.searchParams.set(
      "v",
      Date.now().toString()
    );

    console.info("Loading header:", headerUrl.href);

    const response = await fetch(headerUrl.href, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Could not load header.html (${response.status}).`
      );
    }

    const headerHTML = await response.text();

    // Insert the header into the page.
    container.innerHTML = headerHTML;

    // Confirm the navigation was loaded.
    const navigation = container.querySelector(
      ".portfolio-header__nav"
    );

    if (!navigation) {
      throw new Error(
        'The navigation element was not found in header.html.'
      );
    }

    // Check whether the X icon exists.
    const xIcon = container.querySelector(
      '.portfolio-header__social[aria-label="X"] svg'
    );

    if (xIcon) {
      console.info("X icon found in header.html.");
    } else {
      console.error(
        'X icon not found. Check the X link in header.html.'
      );
    }

    // Highlight the current page.
    const links = Array.from(
      navigation.querySelectorAll(
        ".portfolio-header__link"
      )
    );

    function updateActiveLink() {
      const currentPath = normalizedPath(
        window.location.pathname
      );

      links.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
          return;
        }

        const target = new URL(
          href,
          document.baseURI
        );

        const targetPath = normalizedPath(
          target.pathname
        );

        const active =
          target.origin === window.location.origin &&
          targetPath === currentPath;

        link.classList.toggle("is-active", active);

        if (active) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    updateActiveLink();

    window.addEventListener(
      "hashchange",
      updateActiveLink
    );

    window.addEventListener(
      "popstate",
      updateActiveLink
    );

    // Load header.js after inserting header.html.
    const existingHeaderScript =
      document.querySelector(
        'script[data-header-script="true"]'
      );

    if (!existingHeaderScript) {
      const script = document.createElement("script");

      script.src = new URL(
        "header.js",
        loaderBase
      ).href;

      script.dataset.headerScript = "true";

      script.onload = () => {
        console.info("header.js loaded successfully.");
      };

      script.onerror = () => {
        console.error(
          "Could not load header.js:",
          script.src
        );
      };

      document.body.appendChild(script);
    }

    console.info(
      "Portfolio header loaded successfully."
    );

  } catch (error) {
    console.error(
      "Header loading failed:",
      error
    );

    container.textContent =
      "Navigation could not be loaded. " +
      "Check header.html and run the project with VS Code Live Server.";
  }
})();