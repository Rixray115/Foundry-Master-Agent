#!/bin/bash
# Graphify convenience wrapper for pi-foundry
# Auto-detects graphify Python from uv tool install or PATH.
# Usage: ./graphify.sh query "question" | ./graphify.sh path A B | ./graphify.sh explain Node

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Find graphify Python
if [ -f "$HOME/.pi/graphify/.graphify_python" ]; then
  GRAPHIFY_PY=$(cat "$HOME/.pi/graphify/.graphify_python")
elif GRAPHIFY_PY=$(uv tool run --from graphifyy python -c "import sys; print(sys.executable)" 2>/dev/null); then
  :
elif command -v graphify &>/dev/null; then
  exec graphify "$@"
else
  echo "❌ Graphify not found. Install with: uv tool install graphifyy"
  exit 1
fi

exec "$GRAPHIFY_PY" -m graphify "$@"
