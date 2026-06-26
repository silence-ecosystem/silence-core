# File: /home/ewa/silence/00_inbox/github-preflight.sh
#!/usr/bin/env bash
set -euo pipefail

cd /home/ewa/silence

# stan repo lokalnego
pwd
git rev-parse --is-inside-work-tree
git remote -v
git branch --show-current
git status --short
git rev-parse HEAD

# weryfikacja, że origin wskazuje na właściwe repo
git remote get-url origin

# opcjonalnie: szybki odczyt default branch z GitHub CLI
gh repo view silence-ecosystem/silence-core --json name,owner,defaultBranchRef,url

# pobranie świeżego stanu z origin
git fetch origin --prune --tags

# różnica local vs remote
git rev-parse origin/main
git log --oneline --decorate --graph --max-count=15 HEAD origin/main
git diff --stat origin/main...HEAD
