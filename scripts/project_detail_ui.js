(function () {
  const galleryItems = [];
  let currentIndex = 0;

  const lightbox = document.createElement("div");
  lightbox.id = "imgLightbox";
  lightbox.innerHTML =
    '<button class="nav prev">&#10094;</button>' +
    "<figure>" +
    '<img alt="">' +
    "<figcaption></figcaption>" +
    "</figure>" +
    '<button class="nav next">&#10095;</button>';
  let isSwiping = false;
  let touchStartX = 0;

  lightbox.addEventListener("click", function () {
    if (isSwiping) {
      isSwiping = false;
      return;
    }
    lightbox.classList.remove("show");
  });

  lightbox.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
      isSwiping = false;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchmove",
    function (e) {
      if (Math.abs(e.touches[0].clientX - touchStartX) > 30) {
        isSwiping = true;
      }
    },
    { passive: true }
  );

  lightbox.addEventListener("touchend", function (e) {
    if (!isSwiping) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 0) {
      showLightbox(currentIndex - 1);
    } else {
      showLightbox(currentIndex + 1);
    }
  });
  document.body.appendChild(lightbox);

  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");
  prevBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showLightbox(currentIndex - 1);
  });
  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showLightbox(currentIndex + 1);
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
    else if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
    else if (e.key === "Escape") lightbox.classList.remove("show");
  });

  function showLightbox(index) {
    if (!galleryItems.length) return;
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;
    const item = galleryItems[currentIndex];
    lightbox.querySelector("img").src = item.src;
    lightbox.querySelector("figcaption").textContent = item.caption || "";
    lightbox.classList.add("show");
  }

  function initGallery() {
    const g = document.querySelector(".gallery");
    if (!g) return;
    let idx = 0;
    g.querySelectorAll("figure").forEach(function (fig) {
      const img = fig.querySelector(".thumb img") || fig.querySelector("img");
      if (!img) return;
      const capEl = fig.querySelector("figcaption");
      const i = idx;
      galleryItems.push({
        src: img.src,
        caption: capEl ? capEl.textContent.trim() : "",
      });
      img.addEventListener("click", function () {
        showLightbox(i);
      });
      idx += 1;
    });
  }

  function renderMath() {
    if (!window.renderMathInElement) return;
    const root = document.getElementById("projectContainer");
    if (!root) return;
    renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
    renderMathInElement(root, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
      ],
      throwOnError: false,
      macros: {
        "\\E": "\\times 10^{#1}",
        "\\unit": "\\,\\mathrm{#1}",
        "\\qty": "{#1}\\,\\mathrm{#2}",
        "\\He": "\\mathrm{He}^{+}",
        "\\K": "\\mathrm{K}",
        "\\eV": "\\mathrm{eV}",
      },
    });
  }

  function initOutline() {
    const links = Array.from(document.querySelectorAll(".rail-outline a"));
    if (!links.length) return;
    const byTarget = new Map();
    links.forEach(function (a) {
      const href = a.getAttribute("href") || "";
      const hash = href.indexOf("#");
      if (hash < 0) return;
      const id = decodeURIComponent(href.slice(hash + 1));
      const el = document.getElementById(id);
      if (!el) return;
      if (!byTarget.has(el)) byTarget.set(el, []);
      byTarget.get(el).push(a);
    });
    if (!byTarget.size) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.remove("is-active");
          });
          const activeLinks = byTarget.get(entry.target) || [];
          activeLinks.forEach(function (a) {
            a.classList.add("is-active");
          });
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    byTarget.forEach(function (_links, el) {
      observer.observe(el);
    });
  }

  function initProjectDrawer() {
    const drawer = document.getElementById("projectDetailsDrawer");
    const openButton = document.querySelector("[data-project-drawer-open]");
    if (!drawer || !openButton) return;

    const closeButtons = Array.from(
      drawer.querySelectorAll("[data-project-drawer-close]")
    );
    const sheet = drawer.querySelector(".project-drawer-sheet");

    function openDrawer() {
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("project-drawer-open");
      if (sheet) sheet.focus({ preventScroll: true });
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("project-drawer-open");
    }

    openButton.addEventListener("click", openDrawer);
    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeDrawer);
    });
    drawer.querySelectorAll("a[href*='#']").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGallery();
    renderMath();
    initOutline();
    initProjectDrawer();
  });
})();
