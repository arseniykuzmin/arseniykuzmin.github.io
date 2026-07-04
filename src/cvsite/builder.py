#!/usr/bin/env python3
"""
Static site generator: render dist/* from Jinja2 templates + JSON/Markdown data.
"""
from __future__ import annotations

import html
import json
import re
import shutil
from pathlib import Path

import markdown
import yaml
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
DATA = ROOT / "data"
TEMPLATES = ROOT / "templates"
PROJECTS_SRC = ROOT / "projects"
STATIC = ROOT / "static"
SITE_URL = "https://arseniykuzmin.github.io"
MIRROR_URL = "https://queezz.github.io"
STATIC_DIRS = ("img", "styles", "static")
ROOT_STATIC_FILES = (".nojekyll",)
SCRIPT_FILES = ("project_detail_ui.js", "scroltotop.js")


def load_json(name: str):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def esc_attr(s) -> str:
    return html.escape(str(s), quote=True)


def esc_text(s) -> str:
    return html.escape(str(s), quote=False)


def site_asset_url(url) -> str:
    if not url:
        return url
    u = str(url).strip()
    if re.match(r"^(?:https?:|data:|/)", u, re.I):
        return u
    return "/" + u.lstrip("/")


def page_url(path: str) -> str:
    if not path:
        return SITE_URL + "/"
    return SITE_URL + "/" + path.lstrip("/")


def mirror_url(path: str) -> str:
    if not path:
        return MIRROR_URL + "/"
    return MIRROR_URL + "/" + path.lstrip("/")


def render_ctx(path: str = "", nav_active: str | None = None) -> dict:
    return {
        "base_href": "/",
        "site_url": SITE_URL,
        "mirror_url": MIRROR_URL,
        "canonical_url": page_url(path),
        "alternate_url": mirror_url(path),
        "nav_active": nav_active,
    }


def size_attr_dict(sizes: dict, src: str) -> dict:
    if not src:
        return {}
    key = str(src).lstrip("/")
    info = sizes.get(key)
    if not info:
        return {}
    return {"width": str(info["width"]), "height": str(info["height"])}


def transform_authors_py(authors: str | None) -> Markup:
    """Port of transformAuthors() in scripts/publications.js."""
    if not authors:
        return Markup("")
    if " and " not in authors:
        name_parts = [x.strip() for x in authors.strip().split(", ")]
        if len(name_parts) == 2:
            initials = " ".join(p[0] + "." for p in name_parts[1].split() if p)
            return Markup(f"{initials} {name_parts[0]}")
        if len(name_parts) <= 1:
            return Markup(esc_text(authors))
        initials = " ".join(p[0] + "." for p in name_parts[:-1] if p)
        return Markup(f"{initials} {name_parts[-1]}")
    out: list[str] = []
    for author in authors.split(" and "):
        name_parts = [x.strip() for x in author.strip().split(", ")]
        if len(name_parts) == 2:
            initials = " ".join(p[0] + "." for p in name_parts[1].split() if p)
            if "kuzmin" in name_parts[0].lower():
                out.append(f"<b><u>{initials} {name_parts[0]}</u></b>")
            else:
                out.append(f"{initials} {name_parts[0]}")
        else:
            initials = " ".join(p[0] + "." for p in name_parts[:-1] if p)
            if "kuzmin" in name_parts[0].lower():
                out.append(f"<b><u>{initials} {name_parts[-1]}</u></b>")
            else:
                out.append(f"{initials} {name_parts[-1]}")
    return Markup(", ".join(out))


def initial_publications_sorted(data: list) -> list:
    return sorted(data, key=lambda x: int(x["year"]), reverse=True)


def initial_conferences_sorted(data: list) -> list:
    return sorted(data, key=lambda x: int(x["conference"]["year"]), reverse=True)


def parse_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    raw = text[3:end].strip()
    fm = yaml.safe_load(raw) or {}
    body = text[end + 4 :].lstrip("\n").lstrip()
    return fm, body


def split_lead(body: str) -> tuple[str, str]:
    parts = body.split("<!--more-->")
    if len(parts) == 1:
        return body, ""
    return parts[0], "<!--more-->".join(parts[1:])


def md_to_html_fragment(md: str, sizes: dict) -> str:
    if not md.strip():
        return ""
    html_out = markdown.markdown(
        md,
        extensions=["extra", "tables", "nl2br", "sane_lists"],
    )
    soup = BeautifulSoup(html_out, "html.parser")
    for p in list(soup.find_all("p")):
        imgs = [c for c in p.children if getattr(c, "name", None) == "img"]
        if len(imgs) != 1:
            continue
        non_empty_text = False
        for c in p.children:
            if getattr(c, "name", None) == "img":
                continue
            if isinstance(c, str):
                if c.strip():
                    non_empty_text = True
                    break
            else:
                non_empty_text = True
                break
        if non_empty_text:
            continue
        img = imgs[0]
        raw_src = img.get("src") or ""
        sau = site_asset_url(raw_src)
        fig = soup.new_tag("figure", attrs={"class": "md-figure"})
        new_img = soup.new_tag("img", src=sau)
        new_img["alt"] = img.get("alt") or ""
        new_img["loading"] = "lazy"
        new_img["decoding"] = "async"
        wh = size_attr_dict(sizes, sau)
        if wh:
            new_img["width"] = wh["width"]
            new_img["height"] = wh["height"]
        fig.append(new_img)
        title = img.get("title")
        if title:
            fc = soup.new_tag("figcaption")
            fc.string = title
            fig.append(fc)
        p.replace_with(fig)
    return str(soup)


def slugify(text: str) -> str:
    s = re.sub(r"[^\w\s-]", "", str(text).lower()).strip()
    s = re.sub(r"[\s_]+", "-", s)
    return s or "section"


def build_project_container_html(
    slug: str, project: dict, sizes: dict
) -> tuple[Markup, list[dict]]:
    md_path = PROJECTS_SRC / slug / "index.md"
    raw = md_path.read_text(encoding="utf-8")
    fm, body = parse_front_matter(raw)
    lead, rest = split_lead(body)
    title = project["title"]
    parts: list[str] = []
    parts.append('<header class="project-header">')
    parts.append(f'<p class="project-kicker">{esc_text(project.get("category", "Selected work"))}</p>')
    parts.append(f'<h1 class="project-title">{esc_text(title)}</h1>')
    summary = project.get("summary")
    if summary:
        parts.append(f'<p class="project-subtitle">{esc_text(summary)}</p>')
    parts.append("</header>")
    layout_classes = ["project-layout"]
    hero_raw = fm.get("hero") or project.get("imageUrl") or ""
    hero_src = site_asset_url(hero_raw) if hero_raw else ""
    if not hero_src:
        layout_classes.append("full")
    if fm.get("layout") == "full":
        layout_classes.append("full")
    parts.append(f'<section class="{" ".join(layout_classes)}">')
    if hero_src:
        wh = size_attr_dict(sizes, hero_src)
        w_h = ""
        if wh:
            w_h = f' width="{esc_attr(wh["width"])}" height="{esc_attr(wh["height"])}"'
        fig_inner = (
            f'<img src="{esc_attr(hero_src)}" alt="{esc_attr(title)}" '
            f'decoding="async" fetchpriority="high"{w_h}>'
        )
        cap = fm.get("hero_caption")
        if cap:
            fig_inner += f"<figcaption>{esc_text(cap)}</figcaption>"
        parts.append(f'<figure class="project-figure">{fig_inner}</figure>')
    lead_html = md_to_html_fragment(lead, sizes)
    parts.append(f'<article class="project-body">{lead_html}</article>')
    parts.append("</section>")
    if rest.strip():
        more_html = md_to_html_fragment(rest, sizes)
        parts.append(f'<section class="project-more">{more_html}</section>')
    gallery = fm.get("gallery")
    if isinstance(gallery, list) and gallery:
        single = len(gallery) == 1
        parts.append(f'<div class="gallery{" single" if single else ""}">')
        for item in gallery:
            if not isinstance(item, dict):
                continue
            src = site_asset_url(item.get("src", ""))
            wh = size_attr_dict(sizes, src)
            w_h = ""
            if wh:
                w_h = f' width="{esc_attr(wh["width"])}" height="{esc_attr(wh["height"])}"'
            cap = item.get("caption")
            cap_h = f"<figcaption>{esc_text(cap)}</figcaption>" if cap else ""
            parts.append(
                f'<figure><div class="thumb"><img src="{esc_attr(src)}" alt="" '
                f'loading="lazy" decoding="async"{w_h}></div>{cap_h}</figure>'
            )
        parts.append("</div>")

    body_html = "".join(parts)
    soup = BeautifulSoup(body_html, "html.parser")
    outline: list[dict] = []
    used_ids: set[str] = set()
    for heading in soup.find_all(["h2", "h3"]):
        text = heading.get_text(strip=True)
        if not text:
            continue
        base = slugify(text)
        hid = base
        n = 1
        while hid in used_ids:
            hid = f"{base}-{n}"
            n += 1
        used_ids.add(hid)
        heading["id"] = hid
        outline.append({"id": hid, "text": text, "level": int(heading.name[1])})
    return Markup(str(soup)), outline


def make_env() -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES)),
        autoescape=select_autoescape(["html", "xml"]),
    )
    env.filters["transform_authors"] = transform_authors_py
    return env


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def copy_file(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def copy_static_assets() -> None:
    for dirname in STATIC_DIRS:
        shutil.copytree(ROOT / dirname, DIST / dirname)

    for filename in ROOT_STATIC_FILES:
        copy_file(ROOT / filename, DIST / filename)

    for filename in SCRIPT_FILES:
        copy_file(ROOT / "scripts" / filename, DIST / "scripts" / filename)

    for path in PROJECTS_SRC.rglob("*"):
        if not path.is_file() or path.suffix.lower() in {".html", ".md"}:
            continue
        copy_file(path, DIST / path.relative_to(ROOT))


def main() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)
    copy_static_assets()

    env = make_env()
    about = load_json("about.json")
    publications = load_json("publications.json")
    conferences = load_json("conferences.json")
    projects = load_json("projects.json")
    image_sizes = load_json("image-sizes.json")

    pubs_sorted = initial_publications_sorted(publications)
    conf_sorted = initial_conferences_sorted(conferences)

    write(
        DIST / "index.html",
        env.get_template("pages/index.html").render(
            **render_ctx(nav_active="about"),
            about=about,
        ),
    )
    write(
        DIST / "projects.html",
        env.get_template("pages/projects.html").render(
            **render_ctx("projects.html", nav_active="projects"),
            projects=projects,
            image_sizes=image_sizes,
        ),
    )
    write(
        DIST / "publications.html",
        env.get_template("pages/publications.html").render(
            **render_ctx("publications.html", nav_active="publications"),
            publications=publications,
            publications_sorted=pubs_sorted,
        ),
    )
    write(
        DIST / "conferences.html",
        env.get_template("pages/conferences.html").render(
            **render_ctx("conferences.html", nav_active="conferences"),
            conferences=conferences,
            conferences_sorted=conf_sorted,
        ),
    )

    # dist/projects/<slug>/index.html
    tpl_detail = env.get_template("pages/project_detail.html")
    projects_nav = [{"slug": p["slug"], "title": p["title"]} for p in projects]
    for proj in projects:
        slug = proj["slug"]
        body_html, outline = build_project_container_html(slug, proj, image_sizes)
        write(
            DIST / "projects" / slug / "index.html",
            tpl_detail.render(
                **render_ctx(f"projects/{slug}/", nav_active="projects"),
                project=proj,
                project_body=body_html,
                outline=outline,
                projects_nav=projects_nav,
                current_slug=slug,
            ),
        )

    print(f"Wrote site under {DIST}")


if __name__ == "__main__":
    main()
