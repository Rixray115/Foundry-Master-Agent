# PI-Foundry Knowledge Base

Conocimiento curado sobre los módulos de FoundryVTT para el agente PI.
**64 documentos** cubriendo 55 módulos instalados + documentación técnica.

## Índice — Módulos Principales

| Archivo | Módulo | Versión | Función |
|---|---|---|---|
| [midi-qol.md](midi-qol.md) | MidiQOL | 14.0.11 | Automatización de combate D&D 5e |
| [dae.md](dae.md) | DAE | 14.0.12 | Dynamic Active Effects |
| [sequencer.md](sequencer.md) | Sequencer | 4.2.3 | Framework de animaciones |
| [jb2a.md](jb2a.md) | JB2A DnD5e | 0.9.1 | 2104 animaciones .webm |
| [active-auras.md](active-auras.md) | Active Auras | 0.12.7 | Efectos por proximidad |
| [times-up.md](times-up.md) | Times Up | 13.1.9 | Duración de efectos |
| [plutonium.md](plutonium.md) | Plutonium | 2.16.2.v14 | Import desde 5etools + homebrew |
| [tagger.md](tagger.md) | Tagger | 1.6.0 | Etiquetado de tokens |
| [autoanimations.md](autoanimations.md) | Automated Animations | 7.0.17 | Auto-play de animaciones |
| [tokenizer-2.md](tokenizer-2.md) | Tokenizer 2 | 1.2.5 | Generación de token art |
| [dfreds-convenient-effects.md](dfreds-convenient-effects.md) | DFreds Convenient Effects | 9.2.1 | 400+ efectos pre-built |
| [dice-so-nice.md](dice-so-nice.md) | Dice So Nice! | 6.2.9 | Dados 3D |
| [cat.md](cat.md) | Coven's Automation Toolkit | 0.0.6 | API sobre MidiQOL/DAE |

## Documentación Técnica

| Archivo | Tema |
|---|---|
| [dnd5e-gotchas.md](dnd5e-gotchas.md) | Schema V14: AC, HP, movement, activities, save DC |
| [animation-wiring.md](animation-wiring.md) | Wire animations JB2A via postUseActivity hook |
| [ability-use.md](ability-use.md) | Disparar item.use() por script; límites MidiQOL |
| [module-inventory.md](module-inventory.md) | Tabla maestra de 55 módulos + dependencias |
| [graphify-integration.md](graphify-integration.md) | Arquitectura GraphRAG |
| [playbook.md](playbook.md) | Recetario 493 líneas con patrones verificados |

## Módulos Monk's (16 docs)

[monks-active-tiles](monks-active-tiles.md) · [monks-bloodsplats](monks-bloodsplats.md) · [monks-chat-timer](monks-chat-timer.md) · [monks-combat-details](monks-combat-details.md) · [monks-combat-marker](monks-combat-marker.md) · [monks-common-display](monks-common-display.md) · [monks-hotbar-expansion](monks-hotbar-expansion.md) · [monks-little-details](monks-little-details.md) · [monks-pf2e-encounter-aftermath](monks-pf2e-encounter-aftermath.md) · [monks-player-settings](monks-player-settings.md) · [monks-scene-navigation](monks-scene-navigation.md) · [monks-sound-enhancements](monks-sound-enhancements.md) · [monks-tokenbar](monks-tokenbar.md) · [monks-wall-enhancement](monks-wall-enhancement.md) · [monks-suite.md](monks-suite.md)

## Módulos Aeris (5 docs)

[aeris-core](aeris-core.md) · [aeris-animations](aeris-animations.md) · [aeris-cinematic-bars](aeris-cinematic-bars.md) · [aeris-cinematic-view](aeris-cinematic-view.md) · [aeris-smooth-camera](aeris-smooth-camera.md)

## Otros Módulos

[advanced-macros](advanced-macros.md) · [audio-tagger](audio-tagger.md) · [augur-nexus](augur-nexus.md) · [bg3-hud-core](bg3-hud-core.md) · [bg3-hud-dnd5e](bg3-hud-dnd5e.md) · [chris-premades](chris-premades.md) · [_chatcommands](_chatcommands.md) · [combat-tracker-dock](combat-tracker-dock.md) · [dice-calculator](dice-calculator.md) · [document-tagger](document-tagger.md) · [dorman-lakelys-crit-fumble-tables](dorman-lakelys-crit-fumble-tables.md) · [harrowing-helper](harrowing-helper.md) · [item-piles](item-piles.md) · [itemacro](itemacro.md) · [lib-dfreds-migrations](lib-dfreds-migrations.md) · [lib-dfreds-ui-extender](lib-dfreds-ui-extender.md) · [lib-wrapper](lib-wrapper.md) · [looter](looter.md) · [plutonium-addon-automation](plutonium-addon-automation.md) · [psfx](psfx.md) · [socketlib](socketlib.md) · [swarm-reanimated](swarm-reanimated.md) · [tidy5e-sheet](tidy5e-sheet.md)

## Uso

Estos archivos se indexan en el RAG (LevelDB) durante la instalación.
El agente los consulta via `foundry_search_docs` para entender cómo usar cada módulo.

Para regenerar el análisis automático:
```bash
node scripts/analyze-modules.mjs --foundry-dir=/var/foundryvtt/data
```

Para re-indexar en RAG:
```bash
./scripts/ingest-knowledge.sh /var/foundryvtt/data
```

## Versiones

- FoundryVTT: V14.365
- Sistema: dnd5e v5.3.3
- 55 módulos instalados · 64 documentos curados
- Ver [module-inventory.md](module-inventory.md) para tabla completa
