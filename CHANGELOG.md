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

## [0.2.0] — 2026-07-10

### Added
- **Auto-learning system**: `sync_modules`, `analyze_module`, `index_knowledge` handlers
- **RAG `/index-document` endpoint**: Index individual documents at runtime
- **Knowledge base**: 12 curated `.md` files documenting MidiQOL, Sequencer, JB2A, DAE, etc.
- **Module analysis script**: `scripts/analyze-modules.mjs` for static analysis of deployed modules
- **Install script**: `scripts/install.sh` with version checking and batch analysis
- **Boot/Learning protocol** in SKILL.md for automatic module discovery
- **Plutonium import handler**: Import monsters from 5etools with full stats/actions/items
- Documentation: README.md, INSTALL.md, ARCHITECTURE.md

### Changed
- Relay timeout increased from 30s to 120s (Plutonium imports are slow)
- Extension registered 3 new commands: sync_modules, analyze_module, index_knowledge

## [0.1.0] — 2026-07-09

### Added
- Communication bridge: Relay (HTTP+WS), Foundry module (browser), PI extension (4 tools)
- RAG service: LanceDB index, Transformers.js local embeddings, HTTP API
- Handlers: ping, list_active_modules, create_actors, place_tokens, create_journal, run_macro, update_scene, execute_batch, add_items, unsafe_eval
- PI skill: foundry-encounter
- Caddy reverse proxy on :30000
- HMAC-SHA256 authentication
- Audit logging
