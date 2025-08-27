#!/usr/bin/env bash

set -e

git_path="$(git rev-parse --show-toplevel)"
source_path="${git_path}/web"


declare -a changes=( $(git status --porcelain | awk '{ print $NF }') );

if [ ${#changes[@]} -gt 0 ]; then
    1>&2 echo "commit pending changes before generating gh-pages: ${changes[@]}"
    exit 101
fi

branch=$(git branch | grep '^[[:space:]]*[*]' | head -1 | awk '{ print $NF }')

if [ "${branch}" != "gh-pages" ]; then
    git switch -C "gh-pages"
fi

(cd ${source_path} && npm install && npm run build)
if [ -e "${git_path}/index.html"]; then
    rm -f ${git_path}/index.html
fi
if [ -e "${git_path}/assets"]; then
    rm -rf ${git_path}/assets
fi

mv -fv ${source_path}/dist/* .
git add -f assets index.html
git commit -am "gh-pages"
git push -u origin gh-pages
git switch "${branch}"
