async function loadProject() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;

  try {
    const [projects, sizes] = await Promise.all([
      fetch("data/projects.json").then(r => r.json()),
      fetch("data/image-sizes.json").then(r => r.json())
    ]);
    const project = projects.find(p => String(p.id) === String(id));
    if (!project) return;

    document.title = project.title;

    const container = document.getElementById("projectContainer");

    const h1 = document.createElement("h1");
    h1.className = "project-title";
    h1.textContent = project.title;

    const layout = document.createElement("section");
    layout.className = "project-layout";

    const mdPath = project.markdownUrl.replace(/^\//, "");
    const mdText = await (await fetch(mdPath)).text();
    const { fm, body } = parseFrontMatter(mdText);

    // hero/figure
    const sizeAttr = src => {
      const info = sizes[src.replace(/^\//, "")];
      return info ? ` width="${info.width}" height="${info.height}"` : "";
    };

    const heroSrc = fm.hero || project.imageUrl || "";
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
    renderer.image = (href, title, text) =>
      `<figure class="md-figure"><img src="${href}" alt="${escapeHtml(text || "")}" loading="lazy" decoding="async"${sizeAttr(href)}>` +
      (title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "") + `</figure>`;

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
      g.innerHTML = fm.gallery.map(
        item => `<figure><img src="${item.src}" alt="" loading="lazy" decoding="async"${sizeAttr(item.src)}>
          ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}</figure>`
      ).join("");
      container.appendChild(g);
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
