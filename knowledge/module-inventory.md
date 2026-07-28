# Module Inventory — Tabla Maestra de Módulos

## Sistema

| ID | Título | Versión | Función |
|---|---|---|---|
| dnd5e | Dungeons & Dragons Fifth Edition | 5.3.3 | Sistema D&D 2024 |

## Módulos de Automatización

| ID | Título | Versión | Función | API Global |
|---|---|---|---|---|
| midi-qol | Midi QOL | 14.0.11 | Automatización de combate | `globalThis.MidiQOL`, `globalThis.MidiDAEEval` |
| dae | Dynamic Active Effects | 14.0.12 | Efectos dinámicos | `globalThis.DAE` |
| ActiveAuras | Active Auras | 0.12.7 | Efectos por proximidad | — |
| times-up | Times Up | 13.1.9 | Duración de efectos | — |

## Módulos de Animación

| ID | Título | Versión | Función | API Global |
|---|---|---|---|---|
| sequencer | Sequencer | 4.2.3 | Framework de animaciones | `Sequencer` |
| JB2A_DnD5e | JB2A Animated Assets | 0.9.1 | 2104 animaciones .webm | — |
| autoanimations | Automated Animations | 7.0.16 | Auto-play de animaciones | — |

## Módulos de Contenido

| ID | Título | Versión | Función | API Global |
|---|---|---|---|---|
| plutonium | Plutonium | 2.16.2.v14 | Import desde 5etools | `game.plutonium` |
| chris-premades | Cauldron of Plentiful Resources | 1.5.27 | Items pre-automatizados | — |

## Módulos de Utilidad (no curados en RAG pero disponibles)

| ID | Título | Versión | Función | API Global |
|---|---|---|---|---|
| tagger | Tagger | 1.6.0 | Etiquetado de tokens | `Tagger` |
| lib-wrapper | libWrapper | 1.13.5.1 | Wrapper de funciones | `libWrapper` |
| socketlib | socketlib | v1.1.4 | Comunicación entre clientes | `socketlib` |
| dice-so-nice | Dice So Nice! | 6.2.8 | 3D dice | `game.dice3d` |
| dice-calculator | Dice Tray | 3.7.0 | Calculadora de dados | — |
| tidy5e-sheet | Tidy 5e Sheets | 13.5.0 | Sheets compactas | — |
| tokenizer-2 | Tokenizer 2 | 1.2.3 | Editor de tokens | — |
| advanced-macros | Advanced Macros | 2.4.0 | Macros mejoradas | — |

## Módulos de Monk (TheRipper93) — todos V14

| ID | Título | Versión | Función |
|---|---|---|---|
| monks-active-tiles | Active Tile Triggers | 14.01 | Triggers en tiles |
| monks-bloodsplats | Bloodsplats | 14.01 | Sangre visual |
| monks-combat-details | Combat Details | 14.02 | Info de combate |
| monks-combat-marker | Combat Marker | 12.01 | Marcas de combate |
| monks-common-display | Common Display | 14.01 | Display compartido |
| monks-hotbar-expansion | Hotbar Expansion | 14.01 | Hotbar expandido |
| monks-little-details | Little Details | 14.01 | QoL variado |
| monks-player-settings | Player Settings | 14.01 | Settings por jugador |
| monks-scene-navigation | Scene Navigation | 14.02 | Navegación de escenas |
| monks-sound-enhancements | Sound Enhancements | 14.01 | Sonidos ambientales |
| monks-tokenbar | TokenBar | 14.01 | Barra de tokens |
| monks-wall-enhancement | Wall Enhancement | 14.01 | Walls avanzados |
| monks-chat-timer | Chat Timer | 14.01 | Timer en chat |
| theripper-premium-hub | Module Hub | 5.0.7 | Hub de TheRipper93 |

## Módulo PI

| ID | Título | Versión | Función |
|---|---|---|---|
| pi-bridge | PI Bridge | 0.2.2 | Agente IA ↔ FoundryVTT |

## Versiones Soportadas

| Componente | Versión Requerida |
|---|---|
| FoundryVTT | V14 (build 364) — only V14 supported |
| dnd5e | 5.3.3 |
| Node.js | 20+ (recomendado 24) |
| PI Agent | @earendil-works/pi-coding-agent |

## Dependencias entre Módulos

```
midi-qol → dae → (times-up, active-auras)
sequencer → (jb2a, autoanimations)
autoanimations → sequencer, (midi-qol)
active-auras → dae
times-up → dae
chris-premades → midi-qol, dae, times-up
plutonium → (plutonium-addon-automation)
monks-* → socketlib, lib-wrapper
```
