# Graphify Integration — Knowledge Graph

## Overview

PI-Foundry v0.2 integrates [Graphify](https://github.com/coderamp/graphify) as a
**structural analysis layer** complementing the RAG semantic search.

This creates a **GraphRAG** system:

| Layer | Tool | What it answers |
|---|---|---|
| **Structural** | `foundry_query_graph` | "What calls X?", "What classes exist?", "Cross-module deps?" |
| **Semantic** | `foundry_search_docs` | "How to create an actor?", "MidiQOL workflow examples?" |

## Architecture

```
Foundry modules (JS/MJS files)
    │
    ├── Graphify AST extraction (no LLM needed)
    │   → Knowledge graph: nodes = functions/classes, edges = calls
    │   → Community detection: groups related functionality
    │   → God nodes: identifies critical classes
    │   → Surprising connections: cross-module dependencies
    │
    └── RAG semantic index (Transformers.js)
        → Vector embeddings of documentation
        → Semantic search by meaning
```

## Graph Statistics (v0.2)

| Module | Nodes | Edges | Communities |
|---|---|---|---|
| midi-qol | 1178 | 3255 | 75 |
| sequencer | 295 | 340 | 22 |
| dae | 412 | 959 | 13 |
| ActiveAuras | 108 | 343 | 11 |
| times-up | 86 | 252 | 10 |
| tagger | 54 | 115 | 7 |
| **Merged** | **2133** | **5264** | **138** |

## Usage

### Build the graph

```bash
# Full build (from project root)
./scripts/build-graph.sh --foundry-dir /path/to/foundryuserdata

# Incremental update
./scripts/build-graph.sh --foundry-dir /path/to/foundryuserdata --update
```

### Query the graph

```bash
# CLI
cd graphrag/graphify-out
graphify query "What workflow hooks does MidiQOL have?" --graph merged-graph.json
graphify query "How does Sequencer play effects?" --graph merged-graph.json

# Via PI tool (in agent session)
foundry_query_graph({ query: "What calls rollDamage?" })
foundry_query_graph({ query: "Sequencer to JB2A path", mode: "dfs" })
```

### Watch for changes

```bash
./scripts/watch-graph.sh --foundry-dir /path/to/foundryuserdata
```

## Integration with Learning Protocol

When a new module is detected:

```
sync_modules → detects unknown module
  → analyze_module → extracts API surface (regex-based)
  → Graphify --update → rebuilds graph incrementally (AST-based)
  → Agent queries graph for structural relationships
  → index_knowledge → persists to RAG (semantic)
```

## Limitations

- **Bundled JS**: Modules with bundled/minified JS (plutonium, autoanimations,
  chris-premades) may produce empty graphs. AST extraction works best on
  readable source code.
- **No LLM for code**: AST extraction is free (no API calls). Semantic
  extraction of docs/papers would need an LLM but is not used for module code.
- **Python dependency**: Graphify requires Python 3.10+ and `uv tool install graphifyy`.

## Files

| File | Purpose |
|---|---|
| `scripts/build-graph.sh` | Build/rebuild the knowledge graph |
| `scripts/watch-graph.sh` | Watch for module changes and auto-rebuild |
| `graphrag/graphify-out/` | Output directory with graph.json files |
| `graphrag/graphify-out/merged-graph.json` | Merged cross-module graph |
