# CV site

Custom Jinja2 static site for `arseniykuzmin.github.io`.

## Run locally

Open PowerShell in the repository folder.
Activate the project virtual environment:

Create the venv if it does not exist yet:

```powershell
py -m venv "$env:USERPROFILE\.venvs\cvsite"
& "$env:USERPROFILE\.venvs\cvsite\Scripts\Activate.ps1"
python -m pip install -r requirements.txt
```

For later sessions, activate the existing venv:

```powershell
& "$env:USERPROFILE\.venvs\cvsite\Scripts\Activate.ps1"
```

Build the generated site:

```powershell
cvsite build
```

Serve `dist/` as the web root:

```powershell
cvsite serve
```

Open `http://127.0.0.1:8765/`.

Useful options:

```powershell
cvsite serve --port 9000
cvsite serve --no-build
```

`python build.py` is kept as a compatibility wrapper, but `cvsite build` and
`cvsite serve` are the preferred commands.

## Why not VS Code "Go Live"?

The generated HTML uses:

```html
<base href="/">
```

That means local preview must serve `dist/` as the site root. Opening files
directly, or serving the repository root, will resolve paths differently from
GitHub Pages.
