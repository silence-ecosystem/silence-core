# File: /home/ewa/silence/00_inbox/fix-remote-origin.sh
#!/usr/bin/env bash
set -euo pipefail

cd /home/ewa/silence

echo "== BEFORE =="
git remote -v || true

git remote set-url origin https://github.com/silence-ecosystem/silence-core.git

echo
echo "== AFTER =="
git remote -v
