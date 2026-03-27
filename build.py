#!/usr/bin/env python3
"""
Static site generator (PASS 3): build dist/projects.html from Jinja + JSON data.
"""
from __future__ import annotations

import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).resolve().parent
TEMPLATES_DIR = ROOT / "templates"
DIST_DIR = ROOT / "dist"
DATA_DIR = ROOT / "data"


def main() -> None:
    DIST_DIR.mkdir(parents=True, exist_ok=True)

    with open(DATA_DIR / "projects.json", encoding="utf-8") as f:
        projects = json.load(f)
    with open(DATA_DIR / "image-sizes.json", encoding="utf-8") as f:
        image_sizes = json.load(f)

    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html", "xml"]),
    )
    template = env.get_template("pages/projects.html")
    html = template.render(
        base_href="../",
        projects=projects,
        image_sizes=image_sizes,
    )

    out_path = DIST_DIR / "projects.html"
    out_path.write_text(html, encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
