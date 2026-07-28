# Changelog

## [0.2.2] — 2026-07-14

### Added
- **`update_actors` handler** (`scripts/handlers/update-actors.mjs`): Update specific fields on existing actors without recreating them. Supports `systemData` (merged under `system`) and top-level `data` patches.
- Extension tool registered in `pi-foundry-extension/tools.js`

### Fixed
- **Lirea NPC stats** (actor BSAJio4dpCsOqnFg): AC 10→18, HP 0/0→150/150, Speed 0→30 ft. Root cause: dnd5e V14 schema uses `{ calc: "flat", flat: X }` for AC (not `{ flat: true, value: X }`), and NPC movement is stored under `attributes.movement.walk` (not top-level).
- **dnd5e V14 AC schema**: Confirmed from source (`systems/dnd5e/dnd5e.mjs`, class AttributesFields ~line 25777): AC uses `{ calc, flat }` shape; computed value is `Number(ac.flat)` when `calc === "flat"`
- **dnd5e V14 NPC HP schema**: Confirmed from source (`systems/dnd5e/module/actor/components/settings-npc.mjs` ~line 28): HP uses `{ max, value }` shape with FormulaField for max and IntegerField for value
- **dnd5e V14 movement schema**: Confirmed from source (`systems/dnd5e/module/helpers.js`, class MovementField ~line 3076): stored as nested object under `attributes.movement` with `walk`, `fly`, `swim`, `climb` sub-fields
- **config.json Windows path normalization** (Git Bash `/c/...` → `C:\...`)
- **Stale symlink cleanup**: Removed broken symlinks in pi-foundry directory
- **update-scene.mjs fog.mode bug**: Fixed missing migration shim for `fogMode` → `fog.mode`

### Changed
- Module version bumped to 0.2.2 in module.json
- Extension registered new command: update_actors

## [0.2.1] — 2026-07-13

### Changed
- **V14 compatibility migration** (Foundry issue #13436):
  - `module.json`: version bumped to 0.2.1; compatibility range updated to minimum/verified/maximum = 13/14/14
  - `place-tokens.mjs`: replaced deprecated `scene.grid.size` with `canvas.grid?.size`
  - `update-scene.mjs`: added migration shim rewriting deprecated flat Scene properties to V14 nested equivalents:
    - `fogExploration` → `fog.exploration`
    - `fogReset` → `fog.reset`
    - `fogOverlay` → `fog.overlay`
    - `fogExploredColor` → `fog.colors.explored`
    - `fogUnexploredColor` → `fog.colors.unexplored`
    - `globalLight` → `environment.globalLight.enabled`
    - `globalLightThreshold` → `environment.globalLight.darkness.max`
    - `darkness` → `environment.darknessLevel`
  - `unsafe-eval.mjs`: added `foundry` namespace to Function() scope; documented V14-removed globals (AudioHelper, BaseGrid/HexagonalGrid/SquareGrid, Sound, DiceTerm/Die/FateDie/Coin) and their `foundry.*` replacements

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
