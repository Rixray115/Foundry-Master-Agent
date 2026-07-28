# PI-Foundry Knowledge Base

Conocimiento curado sobre los módulos de FoundryVTT para el agente PI.
Cada archivo documenta la API, hooks, patrones de uso y ejemplos de un módulo.
Solo módulos relevantes para la automatización de combate y creación de encuentros en V14.

## Índice (16 archivos curados)

| Archivo | Módulo | Versión | Función |
|---|---|---|---|
| [midi-qol.md](midi-qol.md) | MidiQOL | 14.0.11 | Automatización de combate D&D 5e |
| [sequencer.md](sequencer.md) | Sequencer | 4.2.3 | Framework de animaciones |
| [jb2a.md](jb2a.md) | JB2A DnD5e | 0.9.1 | Biblioteca de 2104 animaciones .webm |
| [dae.md](dae.md) | DAE | 14.0.12 | Dynamic Active Effects |
| [plutonium.md](plutonium.md) | Plutonium | 2.16.2.v14 | Importación desde 5etools |
| [tagger.md](tagger.md) | Tagger | 1.6.0 | Etiquetado de tokens |
| [dnd5e-gotchas.md](dnd5e-gotchas.md) | dnd5e 5.3.3 | 5.3.3 | Schema gotchas: Set fields, skills, activities, save DC, MidiQOL |
| [animation-wiring.md](animation-wiring.md) | dnd5e + Sequencer | 5.3.3 | Cómo enlazar animaciones JB2A al usar una habilidad |
| [ability-use.md](ability-use.md) | dnd5e + MidiQOL | 5.3.3 | Disparar `use()` por script; límites de MidiQOL y tipos save |
| [active-auras.md](active-auras.md) | Active Auras | 0.12.7 | Efectos por proximidad |
| [times-up.md](times-up.md) | Times Up | 13.1.9 | Duración de efectos |
| [autoanimations.md](autoanimations.md) | Automated Animations | 7.0.16 | Auto-play de animaciones |
| [chris-premades.md](chris-premades.md) | Chris's Premades | 1.5.27 | Automatización pre-construida |
| [monks-suite.md](monks-suite.md) | Monk's Modules | V14 | Suite de utilidades (11 módulos) |
| [module-inventory.md](module-inventory.md) | Todos | — | Tabla maestra de todos los módulos |

## Uso

Estos archivos se indexan en el RAG (LevelDB + embeddings) durante la instalación.
El agente los consulta via `foundry_search_docs` para entender cómo usar cada módulo.

## Versiones soportadas

- **FoundryVTT:** V14.364 (build 364) — only V14 supported
- **Sistema:** dnd5e v5.3.3 (D&D 2024)
- **Ver [module-inventory.md](module-inventory.md)** para versiones detalladas

> Nota: los archivos `dnd5e-gotchas.md`, `animation-wiring.md` y `ability-use.md` documentan
> comportamientos verificados en dnd5e 5.3.3 + MidiQOL 14.0.11 + Sequencer 4.2.3. Son la fuente de verdad para
> los handlers `wire_animation` / `use_activity` y evitan re-descubrir gotchas en cada sesión.
