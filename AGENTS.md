# PI-Foundry — Project Instructions

Multi-component D&D 5e automation extension for FoundryVTT. Four parts:
- `extension/` — Node.js process exposing the PI tools (`foundry_execute`, `foundry_search_docs`, ...).
- `relay/` — local HTTP+WS bridge the extension talks to.
- `module/` — FoundryVTT GM-side module that executes commands.
- `rag/` — LanceDB semantic-search service backing `foundry_search_docs`.

Runtime flow (verified): Extension `sendCommand()` → Relay (`:7401`) → Module `BridgeClient` → `CommandRouter` → `handlers[command]` → FoundryVTT. Search: `foundryExtension()` → RAG (`:7402`).

## Knowledge graph (graphify) — authority for impact analysis
Lives in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`). It maps code dependencies AND the cross-process runtime flow. `knowledge/architecture-graph.md` is the curated source of truth for that flow and the module dependency chain.

### Before editing code
If you touch anything under `extension/`, `relay/`, `module/`, or `rag/`, check blast radius first:
- `graphify query "what depends on <file or function>?"`
- `graphify path <A> <B>` for the connection between two nodes
- open `graphify-out/graph.html` for the visual map
This catches cross-process effects the AST can't (e.g. a handler change alters what the Relay forwards to FoundryVTT).

### After changing code
Nothing to do — a git **post-commit hook** (installed via `graphify hook install`) re-extracts changed code and rebuilds `graph.json` + `GRAPH_REPORT.md` automatically.

### After changing docs / `knowledge/`
Docs are excluded from the commit hook by design. Refresh manually:
```
graphify --update
```
The graphify CLI is not on PATH; use the interpreter pinned at `graphify-out/.graphify_python`
(e.g. `"$(cat graphify-out/.graphify_python)" -m graphify --update`). Do NOT run the bare
`graphify` CLI from a Git-Bash terminal: it writes a `.graphify_root` MSYS path (`/c/Users/...`)
that the post-commit hook (native Windows Python) cannot resolve, which silently disables graph rebuilds.

If the graph and reality disagree, trust the source code, fix the doc (`knowledge/*.md` / `ARCHITECTURE.md`), then `graphify --update`.
