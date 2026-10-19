"""Run Node tests in isolation, including when local package.json is empty."""
from pathlib import Path
import argparse
import os
import shutil
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument("--foundry", help="Foundry resources/app directory")
args = parser.parse_args()
env = os.environ.copy()
if args.foundry:
    env["MYZ_TEST_FOUNDRY"] = args.foundry

root = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix="myz-tests-") as folder:
    target = Path(folder)
    shutil.copytree(root / "scripts", target / "scripts")
    shutil.copytree(root / "tests", target / "tests")
    (target / "package.json").write_text('{"type":"module"}')
    for script in (target / "scripts").rglob("*.js"):
        subprocess.run(["node", "--check", str(script)], check=True)
    subprocess.run(["node", "--test", *[str(path) for path in (target / "tests").glob("*.test.mjs")]], check=True, env=env)
