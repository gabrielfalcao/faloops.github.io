#!/usr/bin/env bash

set -e

git_path="$(git rev-parse --show-toplevel)"
source_path="${git_path}/web"


cd ${source_path} && npm install && npm run build
