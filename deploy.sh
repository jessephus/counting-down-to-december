#!/bin/sh
# Rebuilds the film and publishes it to the gh-pages branch (served by GitHub Pages).
set -e
cd "$(dirname "$0")"
node build.mjs
node check.mjs
site=$(mktemp -d)
cp counting-down-full-film.html "$site/index.html"
cp counting-down-full-film.html counting-down-preview.html "$site/"
touch "$site/.nojekyll"
remote=$(git remote get-url origin)
cd "$site"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -q -f "$remote" gh-pages
cd - >/dev/null
rm -rf "$site"
echo "Deployed. Pages may take a minute to update."
