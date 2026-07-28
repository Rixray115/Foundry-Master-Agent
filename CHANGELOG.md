# Changelog

## [0.2.0] — GraphRAG + Animation Effects

### Added — GraphRAG (Graphify + RAG)
- **Graphify integration**: Knowledge graph of Foundry modules (AST-based, no LLM needed)
  - 2,133 nodes, 5,264 edges, 138 communities across 6 modules (midi-qol, sequencer, dae, ActiveAuras, times-up, tagger)
  - `foundry_query_graph` tool for structural queries (call graphs, cross-module deps, class hierarchies)
  - `scripts/build-graph.sh` for building/rebuilding the graph
  - `scripts/watch-graph.sh` for auto-rebuild on module changes
  - `knowledge/graphify-integration.md` documenting the GraphRAG architecture
  - Interactive HTML visualization (`graph.html` via vis-network)

### Added — Animation Effects
- **`set_animation_effect` handler**: Creates Active Effects that control Sequencer animations
  - Supports multiple animations per effect (array of configs)
  - Toggle on/off from Foundry UI (Active Effects panel)
  - Auto-play when token is placed on canvas (`createToken` hook)
  - Auto-cleanup when token is deleted or effect is removed
- **Active Effect lifecycle hooks** in pi-bridge module:
  - `createActiveEffect` → play animations
  - `updateActiveEffect` → toggle play/stop on `disabled` change
  - `deleteActiveEffect` → stop animations
  - `createToken` → auto-play animations for actor's active effects

### Added — Playbook
- **`knowledge/playbook.md`**: 493-line recipe book with verified patterns for all modules
  - Plutonium import, token placement, Sequencer animations, Active Effects
  - GraphRAG usage patterns, Active Auras, DAE, MidiQOL
  - Complete pitfall table (bugs found and fixed)
  - Full encounter recipe (step-by-step)
  - Indexed in RAG for agent search

### Added — Auto-learning (from v0.1)
- `sync_modules`, `analyze_module`, `index_knowledge` handlers
- RAG `/index-document` endpoint for runtime indexing
- 14 curated `.md` knowledge files
- `scripts/analyze-modules.mjs` for batch static analysis
- `scripts/install.sh` with version checking
- Boot/Learning Protocol in SKILL.md
- `plutonium_import` handler
- `play_animation` handler
- `ROADMAP.md`: v0.2-v0.5 plan
- Documentation: README.md, INSTALL.md, INSTALL-WINDOWS.md, ARCHITECTURE.md

### Fixed
- **Sequencer `.name()` ordering**: Must call `.name()` before `.persist()` or effects cannot be stopped by name
- **Sequencer `attachTo`**: `play_animation` handler now uses `.attachTo(token)` when `attachTo: true` (was using `.atLocation()` only)
- **Sequencer effect stopping**: `endEffects({ name })` now works correctly with named effects
- **`play_animation` stop mode**: Added `stop` parameter to stop all or named effects

### Changed
- Extension registered 5 tools: `foundry_execute`, `foundry_search_docs`, `foundry_list_modules`, `foundry_ping`, `foundry_query_graph`
- Extension commands: 15 total (added `set_animation_effect`)
- Boot Protocol updated with Graphify query step (step 4)
- SKILL.md updated with GraphRAG guidelines and GraphRAG tools table
- Relay timeout: 120s (Plutonium imports are slow)
- `.gitignore`: excludes `graphrag/graphify-out/` (regenerated via `build-graph.sh`)

### Verified
- ✅ Orc imported via Plutonium with full stats/items
- ✅ Token placed on scene with aura + electricity animations
- ✅ Animations follow token when moved (`attachTo`)
- ✅ Single Active Effect controls multiple animations (toggle on/off)
- ✅ Animations auto-play when placing new token of same actor
- ✅ `foundry_query_graph` returns structural data (call graphs, communities)
- ✅ `foundry_search_docs` returns semantic results (API documentation)
- ✅ GraphRAG combination reveals insights neither tool alone can provide

## [0.1.0] — 2026-07-09

### Added
- Communication bridge: Relay (HTTP+WS), Foundry module (browser), PI extension (4 tools)
- RAG service: LanceDB index, Transformers.js local embeddings, HTTP API
- Handlers: ping, list_active_modules, create_actors, place_tokens, create_journal, run_macro, update_scene, execute_batch, add_items, unsafe_eval
- PI skill: foundry-encounter
- Caddy reverse proxy on :30000
- HMAC-SHA256 authentication
- Audit logging
