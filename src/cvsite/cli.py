from __future__ import annotations

import argparse
import functools
import http.server
from pathlib import Path

from . import builder


class _NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Serve dist/ with caching disabled so local previews never go stale."""

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def build_command(_args: argparse.Namespace) -> None:
    builder.main()


def serve_command(args: argparse.Namespace) -> None:
    if not args.no_build:
        builder.main()

    dist = builder.DIST
    if not dist.exists():
        raise SystemExit(f"Missing {dist}; run `cvsite build` first.")

    handler = functools.partial(_NoCacheHandler, directory=str(dist))
    with http.server.ThreadingHTTPServer((args.host, args.port), handler) as httpd:
        url = f"http://{args.host}:{args.port}/"
        print(f"Serving {dist} at {url}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="cvsite")
    subparsers = parser.add_subparsers(dest="command", required=True)

    build = subparsers.add_parser("build", help="Build the static site into dist/.")
    build.set_defaults(func=build_command)

    serve = subparsers.add_parser("serve", help="Serve dist/ as the local site root.")
    serve.add_argument("--host", default="127.0.0.1", help="Host to bind.")
    serve.add_argument("--port", default=8765, type=int, help="Port to bind.")
    serve.add_argument("--no-build", action="store_true", help="Serve existing dist/ without rebuilding.")
    serve.set_defaults(func=serve_command)

    return parser


def main(argv: list[str] | None = None) -> None:
    parser = make_parser()
    args = parser.parse_args(argv)
    args.func(args)
