"""Build the installable module from an explicit allowlist of runtime files."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "module.json").read_text())
files = [root / name for name in ("module.json", "README.md", "CHANGELOG.md", "LICENSE")]
for folder in ("assets", "fonts", "lang", "templates", "docs", "examples"):
    files.extend(path for path in (root / folder).rglob("*") if path.is_file())
files.extend((root / "scripts").rglob("*.js"))
files.append(root / "styles/css/main.css")
output = root / "dist" / f"{manifest['id']}-{manifest['version']}.zip"
output.parent.mkdir(exist_ok=True)
(output.parent / "module.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(files):
        relative = path.relative_to(root)
        data = path.read_bytes()
        if relative.as_posix() == "styles/css/main.css":
            data = data.replace(b"/*# sourceMappingURL=main.css.map */", b"")
        archive.writestr(f"{manifest['id']}/{relative.as_posix()}", data)
print(output)
print(output.parent / "module.json")
