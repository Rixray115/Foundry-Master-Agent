#!/usr/bin/env bash
# build-graph.sh — Construye el knowledge graph de módulos de Foundry via Graphify
#
# Uso:
#   ./build-graph.sh --foundry-dir /path/to/foundryuserdata
#   ./build-graph.sh --foundry-dir /path/to/foundryuserdata --update  # incremental

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

FOUNDRY_DIR=""
UPDATE=false

for arg in "$@"; do
  case "$arg" in
    --foundry-dir=*) FOUNDRY_DIR="${arg#*=}" ;;
    --update)        UPDATE=true ;;
  esac
done

if [ -z "$FOUNDRY_DIR" ]; then
  FOUNDRY_DIR="/root/foundryuserdata"
fi

MODULES_DIR="$FOUNDRY_DIR/Data/modules"
OUTPUT_DIR="$PROJECT_DIR/graphrag/graphify-out"

# Get graphify Python
GRAPHIFY_PY=$(uv tool run --from graphifyy python -c "import sys; print(sys.executable)" 2>/dev/null)
if [ -z "$GRAPHIFY_PY" ]; then
  echo "❌ Graphify no encontrado. Instala con: uv tool install graphifyy"
  exit 1
fi

echo "=== Build Graph: Foundry Modules ==="
echo "  Python: $GRAPHIFY_PY"
echo "  Modules: $MODULES_DIR"
echo "  Output:  $OUTPUT_DIR"
echo

mkdir -p "$OUTPUT_DIR"

# Key modules to analyze
KEY_MODULES="midi-qol sequencer dae ActiveAuras times-up plutonium tagger autoanimations chris-premades"

if [ "$UPDATE" = true ]; then
  echo "=== Mode: incremental update ==="
  for mod in $KEY_MODULES; do
    mod_dir="$MODULES_DIR/$mod"
    if [ -d "$mod_dir" ]; then
      echo "  Updating $mod..."
      cd "$mod_dir"
      graphify update . 2>/dev/null || echo "    (skip: no existing graph)"
    fi
  done
else
  echo "=== Mode: full build ==="
  # Build graph for each key module and merge
  GRAPHS=""
  for mod in $KEY_MODULES; do
    mod_dir="$MODULES_DIR/$mod"
    if [ ! -d "$mod_dir" ]; then
      echo "  ⚠️  $mod not found, skipping"
      continue
    fi

    echo "  Building $mod..."
    cd "$mod_dir"

    # Run full pipeline via Python API
    $GRAPHIFY_PY -c "
import json, sys
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections
from graphify.export import to_json

# Detect files
result = detect(Path('.'))
code_files = []
for f in result.get('files', {}).get('code', []):
    p = Path(f)
    code_files.extend(collect_files(p) if p.is_dir() else [p])

if not code_files:
    print('  No code files found')
    sys.exit(0)

# AST extraction (no LLM needed)
extraction = extract(code_files, cache_root=Path('.'))

# Build graph
G = build_from_json(extraction, root='.')
if G.number_of_nodes() == 0:
    print('  Empty graph, skipping')
    sys.exit(0)

# Cluster
communities = cluster(G)
cohesion = score_all(G, communities)
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

# Export
out_dir = Path('$OUTPUT_DIR/$mod')
out_dir.mkdir(parents=True, exist_ok=True)
to_json(G, communities, str(out_dir / 'graph.json'))

# Save analysis
analysis = {
    'nodes': G.number_of_nodes(),
    'edges': G.number_of_edges(),
    'communities': len(communities),
    'gods': gods,
    'surprises': surprises,
}
Path(out_dir / 'analysis.json').write_text(json.dumps(analysis, indent=2, default=str))
print(f'  ✓ {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')
" 2>&1 | tail -3
  done
fi

# Also build graph on knowledge/ directory
echo
echo "=== Building knowledge graph ==="
cd "$PROJECT_DIR/knowledge"
$GRAPHIFY_PY -c "
import json, sys
from pathlib import Path
from graphify.detect import detect
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections
from graphify.export import to_json

result = detect(Path('.'))
doc_files = [Path(f) for f in result.get('files', {}).get('document', [])]
code_files = []
for f in result.get('files', {}).get('code', []):
    p = Path(f)
    code_files.extend(collect_files(p) if p.is_dir() else [p])

all_files = doc_files + code_files
if not all_files:
    print('  No files found')
    sys.exit(0)

# AST for code, semantic skipped (no LLM)
extraction = {'nodes': [], 'edges': [], 'input_tokens': 0, 'output_tokens': 0}
if code_files:
    extraction = extract(code_files, cache_root=Path('.'))

G = build_from_json(extraction, root='.')
if G.number_of_nodes() == 0:
    print('  Empty graph (docs need LLM for semantic extraction)')
    sys.exit(0)

communities = cluster(G)
gods = god_nodes(G)
surprises = surprising_connections(G, communities)

out_dir = Path('$OUTPUT_DIR/knowledge')
out_dir.mkdir(parents=True, exist_ok=True)
to_json(G, communities, str(out_dir / 'graph.json'))
print(f'  ✓ {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')
" 2>&1 | tail -3

# Merge all module graphs into one
echo
echo "=== Merging graphs ==="
GRAPH_FILES=$(find "$OUTPUT_DIR" -name "graph.json" -not -path "*/knowledge/*" 2>/dev/null)
if [ -n "$GRAPH_FILES" ]; then
  graphify merge-graphs $GRAPH_FILES --out "$OUTPUT_DIR/merged-graph.json" 2>&1 | tail -2
  echo "  ✓ Merged graph: $OUTPUT_DIR/merged-graph.json"
else
  echo "  ⚠️  No module graphs to merge"
fi

echo
echo "=== Done ==="
echo "  Graphs in: $OUTPUT_DIR/"
echo "  Query with: graphify query '<question>'"
