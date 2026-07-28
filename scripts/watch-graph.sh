#!/usr/bin/env bash
# watch-graph.sh — Watch Foundry modules dir and rebuild graph on changes
#
# Uso:
#   ./watch-graph.sh --foundry-dir /path/to/foundryuserdata
#   (runs in foreground, Ctrl+C to stop)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

FOUNDRY_DIR="/root/foundryuserdata"

for arg in "$@"; do
  case "$arg" in
    --foundry-dir=*) FOUNDRY_DIR="${arg#*=}" ;;
  esac
done

MODULES_DIR="$FOUNDRY_DIR/Data/modules"
KEY_MODULES="midi-qol sequencer dae ActiveAuras times-up plutonium tagger autoanimations chris-premades"

echo "=== Watch: Foundry modules ==="
echo "  Modules: $MODULES_DIR"
echo "  Key modules: $KEY_MODULES"
echo

# Build watch paths
WATCH_PATHS=""
for mod in $KEY_MODULES; do
  if [ -d "$MODULES_DIR/$mod" ]; then
    WATCH_PATHS="$WATCH_PATHS $MODULES_DIR/$mod"
  fi
done

echo "  Watching: $WATCH_PATHS"
echo

# Use graphify watch on each module
# graphify watch handles file changes and rebuilds incrementally
for mod in $KEY_MODULES; do
  mod_dir="$MODULES_DIR/$mod"
  if [ -d "$mod_dir" ]; then
    echo "  Starting watcher for $mod..."
    graphify watch "$mod_dir" &
  fi
done

echo
echo "=== Watchers running. Ctrl+C to stop. ==="
trap 'kill $(jobs -p) 2>/dev/null; exit 0' INT TERM
wait
