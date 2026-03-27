const galleryItems = [];
let currentIndex = 0;

const lightbox = document.createElement("div");
lightbox.id = "imgLightbox";
lightbox.innerHTML = `
  <button class="nav prev">&#10094;</button>
  <figure>
    <img alt="">
    <figcaption></figcaption>
  </figure>
  <button class="nav next">&#10095;</button>
`;
let isSwiping = false;
let touchStartX = 0;

lightbox.addEventListener("click", () => {
  if (isSwiping) {
    isSwiping = false;
    return;
  }
  lightbox.classList.remove("show");
});

lightbox.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  isSwiping = false;
}, { passive: true });

lightbox.addEventListener("touchmove", e => {
  if (Math.abs(e.touches[0].clientX - touchStartX) > 30) {
    isSwiping = true;
  }
}, { passive: true });

lightbox.addEventListener("touchend", e => {
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
prevBtn.addEventListener("click", e => {
  e.stopPropagation();
  showLightbox(currentIndex - 1);
});
nextBtn.addEventListener("click", e => {
  e.stopPropagation();
  showLightbox(currentIndex + 1);
});

document.addEventListener("keydown", e => {
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

function slugFromPathname() {
  const parts = location.pathname.split("/").filter(Boolean);
  const i = parts.indexOf("projects");
  if (i < 0 || i + 1 >= parts.length) return null;
  let seg = parts[i + 1];
  if (seg.endsWith(".html")) seg = seg.replace(/\.html$/, "");
  if (!seg || seg === "index") return null;
  return seg;
}

/** Root-relative paths like img/foo resolve incorrectly under /projects/<slug>/; force site-root URLs. */
function siteAssetUrl(url) {
  if (!url || /^(?:https?:|data:|\/)/i.test(url)) return url;
  return "/" + String(url).replace(/^\/+/, "");
}

async function loadProject() {
  const idParam = new URLSearchParams(location.search).get("id");
  const slugFromPath = slugFromPathname();
  if (!slugFromPath && !idParam) return;

  const root = typeof window.__SITE_ROOT__ !== "undefined" ? window.__SITE_ROOT__ : "";

  try {
    const [projects, sizes] = await Promise.all([
      fetch(root + "data/projects.json").then(r => r.json()),
      fetch(root + "assets/data/image-sizes.json").then(r => r.json())
    ]);
    let project = null;
    if (slugFromPath) {
      project = projects.find(p => p.slug === slugFromPath);
    } else if (idParam) {
      project = projects.find(p => String(p.id) === String(idParam));
    }
    if (!project) return;

    document.title = project.title;

    const container = document.getElementById("projectContainer");

    const h1 = document.createElement("h1");
    h1.className = "project-title";
    h1.textContent = project.title;

    const layout = document.createElement("section");
    layout.className = "project-layout";

    const mdPath = root + "projects/" + project.slug + "/index.md";
    const mdText = await (await fetch(mdPath)).text();
    const { fm, body } = parseFrontMatter(mdText);

    // hero/figure
    const sizeAttr = src => {
      const info = sizes[src.replace(/^\//, "")];
      return info ? ` width="${info.width}" height="${info.height}"` : "";
    };

    const heroSrc = siteAssetUrl(fm.hero || project.imageUrl || "");
    if (heroSrc) {
      const figure = document.createElement("figure");
      figure.className = "project-figure";
      figure.innerHTML =
        `<img src="${heroSrc}" alt="${escapeHtml(project.title)}" decoding="async" fetchpriority="high"${sizeAttr(heroSrc)}>` +
        (fm.hero_caption ? `<figcaption>${escapeHtml(fm.hero_caption)}</figcaption>` : "");
      layout.appendChild(figure);
    } else {
      layout.classList.add("full");
    }

    // markdown renderer with <figure> for images (title becomes caption)
    const renderer = new marked.Renderer();
    renderer.image = (href, title, text) => {
      const src = siteAssetUrl(href);
      return (
        `<figure class="md-figure"><img src="${src}" alt="${escapeHtml(text || "")}" loading="lazy" decoding="async"${sizeAttr(src)}>` +
        (title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "") +
        `</figure>`
      );
    };

    const [lead, rest] = splitLead(body);
    const article = document.createElement("article");
    article.className = "project-body";
    article.innerHTML = marked.parse(lead, { renderer });

    container.appendChild(h1);
    container.appendChild(layout);
    layout.appendChild(article);

    if (rest) {
      const more = document.createElement("section");
      more.className = "project-more";
      more.innerHTML = marked.parse(rest, { renderer });
      container.appendChild(more);
    }

if (Array.isArray(fm.gallery) && fm.gallery.length) {
  const g = document.createElement("div");
  g.className = "gallery";
  if (fm.gallery.length === 1) g.classList.add("single");

  g.innerHTML = fm.gallery
    .map(item => {
      const src = siteAssetUrl(item.src);
      const captionHtml = item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : "";
      return `<figure>
                <div class="thumb">
                  <img src="${src}" alt="" loading="lazy" decoding="async" ${sizeAttr(src)}>
                </div>
                ${captionHtml}
              </figure>`;
    })
    .join("");

  container.appendChild(g);

  fm.gallery.forEach(item => {
    galleryItems.push({ src: siteAssetUrl(item.src), caption: item.caption || "" });
  });

  g.querySelectorAll("img").forEach((img, idx) => {
    img.addEventListener("click", () => showLightbox(idx));
  });
}


    if (fm.layout === "full") layout.classList.add("full");
  } catch (e) {
    console.error("Error loading project:", e);
  }
// render LaTeX math ($...$, $$...$$, \(..\), \[..\])
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById("projectContainer"), {
        delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$",  right: "$",  display: false },
        { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
    });
    }
    // Render LaTeX after content is in the DOM
    if (window.renderMathInElement) {
    const root = document.getElementById("projectContainer");

    renderMathInElement(root, {
    delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$",  right: "$",  display: false }
    ],
    throwOnError: false,
    macros: {
        "\\E": "\\times 10^{#1}",              // $6\E{17}$
        "\\unit": "\\,\\mathrm{#1}",           // $100\\unit{eV}$
        "\\qty": "{#1}\\,\\mathrm{#2}",        // $\\qty{6\\E{17}}{at\\,s^{-1}\\,m^{-2}}$
        "\\He": "\\mathrm{He}^{+}",            // $\\He$
        "\\K": "\\mathrm{K}",                  // $600\\K$
        "\\eV": "\\mathrm{eV}"                 // $100\\eV$
    }
    });

    }
}

function parseFrontMatter(src) {
  if (!src.startsWith("---")) return { fm: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { fm: {}, body: src };
  const raw = src.slice(3, end).trim();
  let fm = {};
  try { fm = jsyaml.load(raw) || {}; } catch {}
  const body = src.slice(end + 4).replace(/^\s+/, "");
  return { fm, body };
}

function splitLead(md) {
  const parts = md.split("<!--more-->");
  if (parts.length === 1) return [md, ""];
  return [parts[0], parts.slice(1).join("<!--more-->")];
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[m]));
}

loadProject();
