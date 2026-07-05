#!/usr/bin/env python3
"""
Static site generator: render dist/* from Jinja2 templates + JSON/Markdown data.
"""
from __future__ import annotations

import html
import json
import re
import shutil
import time
from datetime import date
from pathlib import Path

import markdown
import yaml
from bs4 import BeautifulSoup
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
DATA = ROOT / "data"
TEMPLATES = ROOT / "templates"
PROJECTS_SRC = ROOT / "projects"
STATIC = ROOT / "static"
GENERATED_ASSETS = "generated"
SITE_URL = "https://arseniykuzmin.github.io"
MIRROR_URL = "https://queezz.github.io"
STATIC_DIRS = ("img", "styles", "static")
ROOT_STATIC_FILES = (".nojekyll",)
SCRIPT_FILES = ("project_detail_ui.js", "scroltotop.js")
ASSET_VERSION = str(int(time.time()))

VENUE_ABBR = {
    "Atoms": "Atoms",
    "arXiv": "arXiv",
    "arXive": "arXiv",
    "Bulletin of the Russian Academy of Sciences: Physics": "RuAcadPhys",
    "Fusion Engineering and Design": "FED",
    "Journal of Nuclear Materials": "JNM",
    "Journal of Physics: Conference Series": "JPConf",
    "Journal of Plasma and Fusion Research": "JPFR",
    "Journal of Plasma Fusion Research": "JPFR",
    "Journal of Quantitative Spectroscopy and Radiative Transfer": "JQSRT",
    "Journal of Surface Investigation. X-ray, Synchrotron and Neutron Techniques": "RuSurface",
    "Journal of Surface Investigation. X-ray, Synchrotron and Neutron Techniques volume": "RuSurface",
    "Journal of Surface Investigation: X-ray, Synchrotron and Neutron Techniques": "RuSurface",
    "Nuclear Materials and Energy": "NME",
    "Physics of Plasmas": "PoP",
    "Physics of Plasma": "PoP",
    "Plasma and Fusion Research": "PFR",
    "Plasma and Fusion Research: Letters": "PFR",
    "Plasma and Fusion Research: Rapid Communications": "PFR",
    "Plasma and Fusion Research: Regular Articles": "PFR",
    "Plasma Physics and Controlled Fusion": "PPCF",
    "Review of Scientific Instruments": "RSI",
    "Vacuum": "Vacuum",
}


def load_json(name: str):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def badge_hue(text: str) -> int:
    total = sum(ord(ch) for ch in str(text))
    return 20 + (total % 300)


def venue_code(name: str | None) -> str:
    if not name:
        return "Work"
    full = str(name).strip()
    base = full.split(":", 1)[0].strip()
    return VENUE_ABBR.get(full) or VENUE_ABBR.get(base) or acronym(full, max_len=10)


def acronym(text: str, max_len: int = 8) -> str:
    words = re.findall(r"[A-Za-z0-9]+", str(text))
    if not words:
        return "Work"
    caps = "".join(w[0].upper() for w in words if w[:1].isalpha())
    if len(caps) >= 2:
        return caps[:max_len]
    return "".join(words[:2])[:max_len] or "Work"


def anchor_token(text: str, fallback: str = "item") -> str:
    token = re.sub(r"[^a-z0-9]+", "-", str(text).lower()).strip("-")
    return token or fallback


def publication_anchor_base(pub: dict) -> str:
    key = str(pub.get("doi") or pub.get("title") or "").strip()
    return "paper-" + anchor_token(key, fallback="publication")


def conference_code(conference: dict) -> str:
    explicit = str(conference.get("conf") or "").strip()
    if explicit:
        return explicit
    name = str(conference.get("name") or "").strip()
    matches = re.findall(r"\(([^()]+)\)", name)
    if matches:
        code = matches[-1]
        code = re.sub(r"\b(?:19|20)\d{2}\b", "", code).strip(" -/")
        if code:
            ordinal = re.search(r"\b(\d+)(?:st|nd|rd|th)\b", name, re.I)
            if code.upper() == "PSI" and ordinal:
                return f"PSI-{ordinal.group(1)}"
            return code
    return acronym(name, max_len=12)


def enrich_publications(publications: list[dict]) -> list[dict]:
    out = []
    seen_anchors: dict[str, int] = {}
    for pub in publications:
        item = dict(pub)
        code = venue_code(item.get("venue"))
        item["venue_abbr"] = code
        item["badge_hue"] = badge_hue(code)
        base = publication_anchor_base(item)
        seen_anchors[base] = seen_anchors.get(base, 0) + 1
        item["anchor_id"] = base if seen_anchors[base] == 1 else f"{base}-{seen_anchors[base]}"
        out.append(item)
    return out


def publication_doi_key(doi: str | None) -> str:
    return str(doi or "").strip().lower()


def project_publication_dois(project: dict) -> list[str]:
    values = []
    for key in ("publicationDoi", "publicationDois", "relatedPublicationDois"):
        raw = project.get(key)
        if not raw:
            continue
        if isinstance(raw, str):
            values.append(raw)
        elif isinstance(raw, list):
            values.extend(str(item) for item in raw if item)
    return values


def enrich_projects(projects: list[dict], publications: list[dict]) -> list[dict]:
    publications_by_doi: dict[str, dict] = {}
    for pub in publications:
        key = publication_doi_key(pub.get("doi"))
        if key and key not in publications_by_doi:
            publications_by_doi[key] = pub

    out = []
    for project in projects:
        item = dict(project)
        label_overrides = item.get("relatedPublicationLabels") or {}
        note_overrides = item.get("relatedPublicationNotes") or {}
        related = []
        seen: set[str] = set()
        for doi in project_publication_dois(item):
            key = publication_doi_key(doi)
            if not key or key in seen:
                continue
            seen.add(key)
            pub = publications_by_doi.get(key)
            if not pub:
                continue
            default_label = " ".join(
                part for part in (str(pub.get("venue_abbr") or "Paper"), str(pub.get("year") or "")) if part
            )
            label = label_overrides.get(key) or label_overrides.get(str(doi)) or default_label
            note = note_overrides.get(key) or note_overrides.get(str(doi)) or ""
            related.append(
                {
                    "href": f"publications.html#{pub['anchor_id']}",
                    "short_label": label,
                    "note": note,
                    "title": pub.get("title") or label,
                    "doi": pub.get("doi") or doi,
                }
            )
        item["related_papers"] = related
        out.append(item)
    return out


def enrich_conferences(conferences: list[dict]) -> list[dict]:
    out = []
    for conf in conferences:
        item = dict(conf)
        c = dict(item.get("conference") or {})
        code = conference_code(c)
        c["abbr"] = code
        c["badge_hue"] = badge_hue(code)
        item["conference"] = c
        out.append(item)
    return out


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


def asset_url(path: str) -> str:
    return f"{path}?v={ASSET_VERSION}"


def generated_asset_url(path: str) -> str:
    return asset_url(f"{GENERATED_ASSETS}/{path}")


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


def source_path_for_site_asset(src: str) -> Path | None:
    if not src:
        return None
    clean = str(src).split("?", 1)[0].lstrip("/")
    path = ROOT / clean
    if not path.is_file():
        return None
    return path


def fit_size(width: int, height: int, max_width: int, max_height: int | None = None) -> tuple[int, int]:
    max_height = max_height or max_width
    scale = min(max_width / width, max_height / height, 1)
    return max(1, round(width * scale)), max(1, round(height * scale))


def save_optimized_image(src: Path, rel_out: str, max_width: int, quality: int = 78) -> dict | None:
    dst = DIST / GENERATED_ASSETS / rel_out
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        with Image.open(src) as im:
            im = im.convert("RGBA" if im.mode in {"RGBA", "LA", "P"} else "RGB")
            width, height = im.size
            out_w, out_h = fit_size(width, height, max_width)
            if (out_w, out_h) != im.size:
                im = im.resize((out_w, out_h), Image.Resampling.LANCZOS)
            save_kwargs = {"quality": quality, "method": 6}
            if im.mode == "RGBA":
                save_kwargs["lossless"] = False
            im.save(dst, "WEBP", **save_kwargs)
            return {
                "src": f"{GENERATED_ASSETS}/{rel_out}",
                "url": generated_asset_url(rel_out),
                "width": out_w,
                "height": out_h,
            }
    except OSError as exc:
        print(f"Skipping optimized image for {src}: {exc}")
        return None


def build_about_media() -> dict:
    src = source_path_for_site_asset("static/kaa.png")
    if not src:
        return {}
    optimized = save_optimized_image(src, "about/kaa-320.webp", max_width=320, quality=82)
    return optimized or {}


def build_project_card_media(projects: list[dict]) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for project in projects:
        slug = project.get("slug")
        src = source_path_for_site_asset(project.get("imageUrl", ""))
        if not slug or not src:
            continue
        optimized = save_optimized_image(src, f"project-cards/{slug}.webp", max_width=720, quality=78)
        if optimized:
            out[str(slug)] = optimized
    return out


def author_name_span(name: str, is_me: bool = False) -> str:
    safe = esc_text(name.strip())
    if is_me:
        safe = f"<b><u>{safe}</u></b>"
    return f'<span class="author-name">{safe}</span>'


def clean_publication_title(title: str | None) -> str:
    text = str(title or "")
    replacements = {
        r"$\beta$p": "βₚ",
        r"$\beta_p$": "βₚ",
        r"\beta": "β",
        "$": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = re.sub(r"\bH2\b", "H₂", text)
    text = re.sub(r"\bD2\b", "D₂", text)
    text = text.replace("Q-shu university experiment", "Q-shu University Experiment")
    return text


def normalize_author_text(author: str) -> str:
    text = str(author or "").strip()
    text = re.sub(r",(?=\S)", ", ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def initials_name(parts: list[str]) -> str:
    parts = [p.strip() for p in parts if p.strip()]
    if len(parts) == 2:
        initials = " ".join(p[0] + "." for p in parts[1].split() if p)
        return f"{initials} {parts[0]}".strip()
    if len(parts) <= 1:
        return parts[0] if parts else ""
    initials = " ".join(p[0] + "." for p in parts[:-1] if p)
    return f"{initials} {parts[-1]}".strip()


def transform_authors_py(authors: str | None) -> Markup:
    """Port of transformAuthors() in publications_runtime.js."""
    if not authors:
        return Markup("")
    if " and " not in authors:
        normalized = normalize_author_text(authors)
        name_parts = [x.strip() for x in normalized.split(", ")]
        return Markup(author_name_span(initials_name(name_parts), "kuzmin" in authors.lower()))
    out: list[str] = []
    for author in authors.split(" and "):
        normalized = normalize_author_text(author)
        name_parts = [x.strip() for x in normalized.split(", ")]
        out.append(author_name_span(initials_name(name_parts), "kuzmin" in author.lower()))
    return Markup(", ".join(out))


def parse_month_year(value: str | None) -> tuple[int, int] | None:
    if not value:
        return None
    match = re.fullmatch(r"\s*(\d{1,2})/(\d{4})\s*", str(value))
    if not match:
        return None
    month = int(match.group(1))
    year = int(match.group(2))
    if month < 1 or month > 12:
        return None
    return year, month


def experience_duration(start_date: str | None, end_date: str | None) -> str:
    start = parse_month_year(start_date)
    if not start:
        return ""
    if str(end_date).strip().lower() == "present":
        end = (date.today().year, date.today().month)
    else:
        end = parse_month_year(end_date)
    if not end:
        return ""

    months = (end[0] - start[0]) * 12 + (end[1] - start[1])
    if months < 0:
        return ""
    years, rem_months = divmod(months, 12)
    parts = []
    if years:
        parts.append(f"{years}y")
    if rem_months or not parts:
        parts.append(f"{rem_months}m")
    return " ".join(parts)


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
        extensions=["extra", "tables", "sane_lists"],
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
) -> tuple[Markup, list[dict], dict]:
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
        parts.append('<h2 class="project-section-title">Gallery</h2>')
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
    project_meta = {
        "period": fm.get("period") or project.get("period"),
        "lab": fm.get("lab") or project.get("lab"),
        "links": fm.get("links") or [],
    }
    if project.get("relatedUrl"):
        project_meta["links"] = [
            *project_meta["links"],
            {"label": "Related", "url": project["relatedUrl"]},
        ]
    return Markup(str(soup)), outline, project_meta


def make_env() -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES)),
        autoescape=select_autoescape(["html", "xml"]),
    )
    env.filters["transform_authors"] = transform_authors_py
    env.filters["clean_publication_title"] = clean_publication_title
    env.filters["experience_duration"] = experience_duration
    env.globals["asset_url"] = asset_url
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

    copy_file(DATA / "mypapers.bib", DIST / "data" / "ArseniyKuzmin.bib")

    for filename in SCRIPT_FILES:
        copy_file(ROOT / "scripts" / filename, DIST / "scripts" / filename)

    for path in PROJECTS_SRC.rglob("*"):
        if not path.is_file() or path.suffix.lower() in {".html", ".md"}:
            continue
        copy_file(path, DIST / path.relative_to(ROOT))


def clean_dist(path: Path, retries: int = 8, delay: float = 0.5) -> None:
    """Empty dist/ in place, keeping the folder itself.

    Deleting the contents rather than the folder preserves any per-folder
    marker set on it -- notably the Dropbox "ignored" flag -- so the output
    dir stays out of sync across rebuilds. On Windows, Dropbox / antivirus /
    indexers briefly hold handles under dist/, so retry on transient locks
    (WinError 32) instead of crashing the build.
    """
    path.mkdir(parents=True, exist_ok=True)
    for attempt in range(1, retries + 1):
        try:
            for child in path.iterdir():
                if child.is_dir() and not child.is_symlink():
                    shutil.rmtree(child)
                else:
                    child.unlink()
            return
        except OSError:
            if attempt == retries:
                raise
            print(f"{path} is locked; retrying ({attempt}/{retries - 1})...")
            time.sleep(delay)


def main() -> None:
    clean_dist(DIST)
    copy_static_assets()

    env = make_env()
    about = load_json("about.json")
    publications = enrich_publications(load_json("publications.json"))
    conferences = enrich_conferences(load_json("conferences.json"))
    projects = enrich_projects(load_json("projects.json"), publications)
    image_sizes = load_json("image-sizes.json")
    about_media = build_about_media()
    project_card_media = build_project_card_media(projects)

    pubs_sorted = initial_publications_sorted(publications)
    conf_sorted = initial_conferences_sorted(conferences)

    write(
        DIST / "index.html",
        env.get_template("pages/index.html").render(
            **render_ctx(nav_active="about"),
            about=about,
            about_media=about_media,
        ),
    )
    write(
        DIST / "projects.html",
        env.get_template("pages/projects.html").render(
            **render_ctx("projects.html", nav_active="projects"),
            projects=projects,
            image_sizes=image_sizes,
            project_card_media=project_card_media,
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
        body_html, outline, project_meta = build_project_container_html(slug, proj, image_sizes)
        write(
            DIST / "projects" / slug / "index.html",
            tpl_detail.render(
                **render_ctx(f"projects/{slug}/", nav_active="projects"),
                project=proj,
                project_body=body_html,
                outline=outline,
                project_meta=project_meta,
                projects_nav=projects_nav,
                current_slug=slug,
            ),
        )

    print(f"Wrote site under {DIST}")


if __name__ == "__main__":
    main()
