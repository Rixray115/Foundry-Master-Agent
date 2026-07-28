# PI-Foundry — Project Instructions

Multi-component D&D 5e automation extension for FoundryVTT. Four parts:
- `extension/` — Node.js process exposing the PI tools (`foundry_execute`, `foundry_search_docs`, ...).
- `relay/` — local HTTP+WS bridge the extension talks to.
- `module/` — FoundryVTT GM-side module that executes commands.
- `rag/` — local LevelDB semantic-search service (Transformers.js, 384-dim embeddings) backing `foundry_search_docs`.

Runtime flow (verified): Extension `sendCommand()` → Relay (`:7401`) → Module `BridgeClient` → `CommandRouter` → `handlers[command]` → FoundryVTT. Search: `foundryExtension()` → RAG (`:7402`).

## Knowledge graph (graphify) — authority for impact analysis
Lives in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). It maps code dependencies AND the cross-process runtime flow. `knowledge/module-inventory.md` is the curated source of truth for the module dependency chain.

### Before editing code
If you touch anything under `extension/`, `relay/`, `module/`, or `rag/`, check blast radius first:
- `graphify query "what depends on <file or function>?"`
- `graphify path <A> <B>` for the connection between two nodes
- open `graphify-out/graph.html` for the visual map
This catches cross-process effects the AST can't (e.g. a handler change alters what the Relay forwards to FoundryVTT).

### After changing code
Nothing to do — a git **post-commit hook** (installed via `graphify hook install`) re-extracts changed code and rebuilds `graph.json` + `GRAPH_REPORT.md` automatically.

### After changing docs / `knowledge/`
Docs are excluded from the commit hook by design (it is code-only, no LLM). Refresh the semantic graph manually:

```bash
# Use the interpreter graphify pinned (do NOT use the bare `graphify` CLI from Git-Bash —
# it writes an MSYS /.graphify_root that the native-Windows post-commit hook can't resolve):
PY="$(cat graphify-out/.graphify_python)"
export OPENAI_BASE_URL=http://127.0.0.1:1234/v1   # LM Studio (OpenAI-compatible)
export OPENAI_API_KEY=lmstudio
export GRAPHIFY_OPENAI_MODEL=qwen3.6-35b-a3b-mtp   # non-thinking model REQUIRED
"$PY" -m graphify . --backend openai --update       # incremental re-extraction of changed docs
"$PY" -m graphify label . --backend=openai --model=qwen3.6-35b-a3b-mtp   # name the communities
```

Notes:
- LM Studio must be running with the model loaded and **Thinking disabled** (thinking models return empty `content` and graphify hangs waiting for JSON).
- `--update` is incremental — only new/changed docs are re-extracted. If a doc is reported as "produced no nodes", just re-run.
- `graphify label` names communities (otherwise they show as `Community N`); `cluster-only` regenerates `GRAPH_REPORT.md`/`graph.html` from an existing graph with no LLM.
- If the graph and reality disagree, trust the source code: fix the doc (`knowledge/*.md` / `ARCHITECTURE.md`), then re-run `--update`.
- `graphify-out/` is gitignored — the graph is a regenerated artifact, not committed.


## Current State (updated 2026-07-26)

- **RAG**: 29 documents indexed (15 curated + 14 agent-analyzed)
- **Known modules**: 18 with zero version mismatches
- **Graphify**: 285 nodes, 361 edges, 53 communities
- **Bridge commands**: 21/21 verified working

### Automation modules with RAG knowledge
midi-qol, sequencer, JB2A, dae, ActiveAuras, times-up, plutonium, tagger, autoanimations,
CAT, plutonium-addon-automation, dfreds-convenient-effects, dorman-lakelys-crit-fumble-tables,
_chatcommands, audio-tagger, monks-tokenbar, swarm-reanimated, advanced-macros

### Services
- Relay: http://127.0.0.1:7401 (start via `relay/start-relay.bat`)
- RAG: http://127.0.0.1:7402 (start via `node rag/server.mjs`)

### Key commands
- `pi --cwd ~/pi-foundry` to start in project context
- `graphify query "<question>"` from project root for architecture questions
