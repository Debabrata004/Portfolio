/* ============================================
   3D TECHNOLOGY SPHERE
   Smooth rotation, drag, pause and resume
   ============================================ */

(() => {
  "use strict";

  function initSphere() {
    const sphere = document.querySelector(".constellation-wrap");
    const constellation = document.getElementById("constellation");

    if (!sphere || !constellation || sphere.dataset.ready === "true") {
      console.error("Technology sphere HTML elements were not found.");
      return;
    }

    sphere.dataset.ready = "true";

    const cdn =
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

    const technologies = [
      ["HTML5", "html5/html5-original.svg"],
      ["CSS3", "css3/css3-original.svg"],
      ["JavaScript", "javascript/javascript-original.svg"],
      ["Python", "python/python-original.svg"],
      ["Java", "java/java-original.svg"],
      ["C", "c/c-original.svg"],
      ["C++", "cplusplus/cplusplus-original.svg"],
      ["PHP", "php/php-original.svg"],
      ["MySQL", "mysql/mysql-original.svg"],
      ["Git", "git/git-original.svg"],
      ["GitHub", "github/github-original.svg"],
      ["React", "react/react-original.svg"],
      ["Node.js", "nodejs/nodejs-original.svg"],
      ["Bootstrap", "bootstrap/bootstrap-original.svg"],
      ["TypeScript", "typescript/typescript-original.svg"],
      ["VS Code", "vscode/vscode-original.svg"],
      ["Linux", "linux/linux-original.svg"],
      ["Docker", "docker/docker-original.svg"],
      ["MongoDB", "mongodb/mongodb-original.svg"],
      ["PostgreSQL", "postgresql/postgresql-original.svg"],
      ["Spring", "spring/spring-original.svg"],
      ["Kotlin", "kotlin/kotlin-original.svg"],
      ["Figma", "figma/figma-original.svg"],
      ["Firebase", "firebase/firebase-plain.svg"],
      ["Sass", "sass/sass-original.svg"],
      ["Angular", "angular/angular-original.svg"],
      ["Django", "django/django-plain.svg"],
      ["Flask", "flask/flask-original.svg"],
      ["Redis", "redis/redis-original.svg"],
      ["Android", "android/android-original.svg"]
    ];

    constellation.replaceChildren();

    const nodes = [];
    const total = technologies.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Create the technology logo cards.
    technologies.forEach(([name, iconPath], index) => {
      const y = 1 - (2 * (index + 0.5)) / total;
      const radius = Math.sqrt(1 - y * y);
      const angle = index * goldenAngle;

      const node = document.createElement("div");
      node.className = "tech-node";
      node.title = name;
      node.setAttribute("role", "img");
      node.setAttribute("aria-label", name);

      const img = document.createElement("img");
      img.src = cdn + iconPath;
      img.alt = "";
      img.draggable = false;
      img.loading = "eager";

      // Keep a visible fallback if a logo cannot load.
      img.onerror = () => {
        img.remove();
        node.classList.add("icon-failed");
        node.textContent = name.slice(0, 3);
      };

      node.appendChild(img);
      constellation.appendChild(node);

      nodes.push({
        element: node,
        x: Math.cos(angle) * radius,
        y,
        z: Math.sin(angle) * radius
      });
    });

    // Create the pause/resume button.
    const button = document.createElement("button");
    button.className = "sphere-control";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");

    button.innerHTML = `
      <span class="control-dot" aria-hidden="true"></span>
      <span class="control-label">Pause rotation</span>
    `;

    sphere.appendChild(button);

    const buttonLabel = button.querySelector(".control-label");

    let paused = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;

    let rotationX = 0.18;
    let rotationY = -0.45;

    let velocityX = 0;
    let velocityY = 0;

    let lastTime = 0;
    let frameId = 0;

    function setPaused(value) {
      paused = value;
      sphere.classList.toggle("is-paused", paused);
      button.setAttribute("aria-pressed", String(paused));

      buttonLabel.textContent = paused
        ? "Resume rotation"
        : "Pause rotation";
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setPaused(!paused);
    });

    // Rotate 3D coordinates.
    function rotatePoint(point) {
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const x = point.x * cosY - point.z * sinY;
      const z = point.x * sinY + point.z * cosY;

      return {
        x,
        y: point.y * cosX - z * sinX,
        z: point.y * sinX + z * cosX
      };
    }

    // Animation loop.
    function render(time = 0) {
      const delta = lastTime
        ? Math.min((time - lastTime) / 16.667, 2)
        : 1;

      lastTime = time;

      if (!paused && !dragging) {
        rotationY += 0.006 * delta + velocityY;
        rotationX += velocityX;

        velocityX *= 0.94;
        velocityY *= 0.94;
      }

      const bounds = sphere.getBoundingClientRect();
      const radius = Math.min(bounds.width, bounds.height) * 0.34;

      nodes.forEach((node) => {
        const point = rotatePoint(node);
        const depth = (point.z + 1) / 2;

        const x = point.x * radius;
        const y = point.y * radius;
        const z = point.z * radius * 0.25;

        const scale = 0.75 + depth * 0.35;
        const opacity = 0.65 + depth * 0.35;

        node.element.style.transform =
          `translate3d(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px),
            ${z}px
          ) scale(${scale})`;

        node.element.style.opacity = opacity.toFixed(2);
        node.element.style.zIndex = String(
          Math.round(depth * 100)
        );
      });

      frameId = requestAnimationFrame(render);
    }

    // Mouse and touch interaction.
    sphere.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".sphere-control")) return;

      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;

      velocityX = 0;
      velocityY = 0;

      sphere.setPointerCapture(event.pointerId);
    });

    sphere.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - pointerX;
      const dy = event.clientY - pointerY;

      pointerX = event.clientX;
      pointerY = event.clientY;

      rotationY += dx * 0.008;
      rotationX += dy * 0.006;

      rotationX = Math.max(-1.1, Math.min(1.1, rotationX));

      velocityY = dx * 0.00045;
      velocityX = dy * 0.0003;
    });

    function stopDragging() {
      dragging = false;
    }

    sphere.addEventListener("pointerup", stopDragging);
    sphere.addEventListener("pointercancel", stopDragging);
    sphere.addEventListener("lostpointercapture", stopDragging);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!frameId) {
        lastTime = 0;
        frameId = requestAnimationFrame(render);
      }
    });

    setPaused(paused);
    frameId = requestAnimationFrame(render);

    console.log("Technology sphere initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSphere, {
      once: true
    });
  } else {
    initSphere();
  }
})();