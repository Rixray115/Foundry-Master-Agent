---
name: foundry
description: Operate FoundryVTT via the PI agent bridge — automate combat, create actors/tokens/journals/macros, import monsters, manage scenes, wire animations, query module APIs, and run encounters. Use for any FoundryVTT interaction: world-building, combat automation, encounter design, animation wiring, module management, or testing.
---

# Foundry Skill

## Boot Protocol (ejecutar al inicio de cada sesión)

1. **Verifica conectividad**: Llama `foundry_ping`. Si falla, dile al usuario que abra Foundry en el navegador.
2. **Lista módulos activos**: Llama `foundry_list_modules` para ver qué está disponible.
3. **Sincroniza conocimiento**: Llama `foundry_execute` con comando `sync_modules`.
   - Si hay módulos **desconocidos**, ejecuta el Learning Protocol para cada uno.
   - Si hay **versiones distintas**, nota la diferencia y ten cuidado al usar APIs.
   - **⚠️ HotReload caveat:** Si acabas de modificar `module/scripts/handlers/*.mjs`, los cambios pueden no reflejarse hasta que el GM recargue la página de Foundry (F5). El módulo pi-bridge tiene `hotReload` pero no siempre captura cambios en handlers importados estáticamente. Si un comando devuelve resultados inesperados o vacíos, pide al usuario que recargue Foundry.
4. **Construye mapa mental**: Para cada módulo activo, busca `foundry_search_docs("<module> API")` para entender su API.

   **⚠️ RAG scope:** El RAG contiene SOLO 15 documentos curados (`knowledge/*.md`), NO el fuente completo de Foundry ni de módulos de terceros. Si `foundry_search_docs` no encuentra una API específica, consulta el archivo `.md` correspondiente en `knowledge/` (ej. `knowledge/sequencer.md`) o usa `unsafe.eval` (si allowUnsafe está habilitado) para inspeccionar la API directamente.

## Self-Healing Protocol

Cuando algo no funciona como esperas, ejecuta esta checklist:

1. **¿El comando devuelve resultados vacíos sin error?**
   - Posible causa: datos de sistema mal formados. `create_actors` con `systemData` complejo puede fallar silenciosamente si la estructura no coincide con el schema de dnd5e. Revisa `knowledge/dnd5e-gotchas.md` para campos problemáticos (Set fields, skills, activities, save DC).
   - Solución: prueba primero con `systemData: {}` vacío, luego añade campos de a uno.

2. **¿El comando se comporta distinto a lo esperado (ej. sync_modules reporta "known" para módulos que no debería)?**
   - Causa: el handler `.mjs` se modificó en disco pero Foundry aún tiene la versión anterior en caché.
   - Solución: pedir al usuario que recargue Foundry (F5 en el navegador del GM).

3. **¿`plutonium_import` falla o no encuentra un monster?**
   - Verifica que el nombre coincida exactamente con el de 5etools (case-sensitive).
   - Prueba con diferentes sources: `"MM"` (2014), `"XMM"` (2024), `"VGM"`, `"MPMM"`, `"ToB1-2023"`.

4. **¿`foundry_search_docs` no encuentra una API?**
   - El RAG solo indexa 15 documentos curados. Si buscas algo muy específico (ej. nombre exacto de método de Sequencer), lee el archivo relevante en `knowledge/` directamente, o usa `unsafe.eval` (si permitido).

5. **¿Los resultados no coinciden con modules.json en disco?**
   - El módulo pi-bridge está cacheado por el navegador. Recarga Foundry (F5).

6. **¿`unsafe.eval` devuelve null?**
   - `allowUnsafe` no está habilitado. Es normal — por seguridad está deshabilitado por defecto. No depende de esta tool.

## Learning Protocol (para módulos desconocidos)

Cuando `sync_modules` reporta módulos desconocidos:

1. Para cada módulo desconocido, llama `foundry_execute` con comando `analyze_module` y args `{ moduleId: "<module-id>" }`.
2. Analiza la información devuelta:
   - `globals`: APIs expuestas en `globalThis`
   - `hooks`: Eventos que el módulo registra
   - `classes`: Clases principales
   - `publicMethods`: Métodos públicos
   - `readme`: Documentación del autor (si existe)
3. Sintetiza un archivo de conocimiento markdown estructurado:
   ```markdown
   # <Module Name> (<module-id>) — v<version>
   
   ## API Surface
   <globals y methods>
   
   ## Hooks
   <hooks encontrados>
   
   ## Uso
   <patrones inferidos del README y API>
   
   ## Ejemplos
   <ejemplos de código basados en la API>
   ```
4. Persiste el conocimiento: llama `foundry_execute` con comando `index_knowledge` y args `{ module: "<module-id>", content: "<markdown>", title: "<Module Name>" }`.
5. El conocimiento queda indexado en el RAG para futuras sesiones.

**Importante**: Si no puedes determinar con confianza cómo usar un módulo, díselo al usuario:
> "Encontré el módulo X pero no tengo conocimiento curado. Su API parece ser Y. ¿Quieres que intente usarlo o prefieres guiarme?"

## Reglas de Oro

1. **SIEMPRE busca antes de actuar**: Antes de usar cualquier módulo (MidiQOL, Sequencer, DAE, etc.), busca en `foundry_search_docs` primero. Nunca asumas cómo funciona un módulo sin verificar.
2. **Verifica conectividad**: Si `foundry_ping` falla, pide al usuario que abra Foundry en el navegador. No puedes operar sin navegador conectado.
3. **Usa Plutonium para monsters**: Prefiere `plutonium_import` sobre `create_actors` para monsters. Plutonium importa stats, acciones, traits, items y sprites completos desde 5etools.
4. **Reconoce tus límites**: Si no tienes conocimiento sobre un módulo, no inventes. Usa el Learning Protocol o pide ayuda al usuario.
5. **Recarga Foundry tras modificar handlers**: Si modificas `module/scripts/handlers/*.mjs`, pide al usuario recargar Foundry (F5). hotReload no siempre captura cambios en imports estáticos.
6. **systemData complejo puede fallar silenciosamente**: `create_actors` con datos de sistema dnd5e puede devolver `actorIds: []` sin error si algún campo es inválido. Empieza con `systemData: {}` y añade campos de a uno. Ver `knowledge/dnd5e-gotchas.md` para el schema correcto.

## Análisis de Impacto con graphify

El repo mantiene un grafo de conocimiento (graphify) en `graphify-out/`:
- `graph.json` — grafo navegable (271 nodos, 303 aristas, 50 comunidades)
- `GRAPH_REPORT.md` — informe con god nodes, conexiones sorpresa y preguntas sugeridas
- `graph.html` — visualización interactiva

**Regla — verifica el radio de impacto antes de editar un handler.** Antes de modificar
cualquier archivo en `module/scripts/handlers/`, consulta el grafo para ver qué toca:
- `graphify path "<Handler>" "<Otro módulo>"` — camino más corto entre dos conceptos
- `graphify query "<pregunta>"` — traverse de la pregunta por el grafo (BFS/DFS)
- `graphify explain "<nodo>"` — explicación en lenguaje claro de un nodo y sus vecinos

El grafo se mantiene actualizado automáticamente por un `post-commit` hook (re-extrae los
archivos de código cambiados en cada commit). Para cambios en documentos (`knowledge/*.md`),
ejecuta `graphify --update --code-only` manualmente. No reinventes el grafo: es la fuente de verdad de la
arquitectura del módulo y de las dependencias entre módulos.

**Cadena de dependencias (módulos de combate-automatización), según `knowledge/module-inventory.md`:**
`midi-qol → dae → (times-up, active-auras)`; `sequencer → (jb2a, autoanimations)`;
`autoanimations → sequencer, midi-qol`; `chris-premades → midi-qol, dae, times-up`.

## Workflow: Crear un encuentro (ejemplo)

1. **Verifica conectividad** con `foundry_ping`.
2. **Importa monsters** con `foundry_execute` comando `plutonium_import`:
   ```
   foundry_execute("plutonium_import", { creatures: [{ name: "Orc", source: "MM" }, ...] })
   ```
3. **Coloca tokens** con `foundry_execute` comando `place_tokens`:
   ```
   foundry_execute("place_tokens", { tokens: [{ actorId: "...", x: 1000, y: 500 }, ...] })
   ```
4. **Crea diario** con `foundry_execute` comando `create_journal`:
   ```
   foundry_execute("create_journal", { entries: [{ name: "Encuentro", content: "..." }] })
   ```

## Comandos Disponibles

| Comando | Descripción |
|---|---|
| `ping` | Test de conectividad |
| `list_active_modules` | Lista módulos activos |
| `create_actors` | Crea actors manualmente. ⚠️ systemData complejo puede fallar silenciosamente — empezar vacío |
| `update_actors` | Actualiza campos de actores existentes (name, img, systemData, etc.) |
| `place_tokens` | Coloca tokens en escena |
| `create_journal` | Crea entradas de diario |
| `run_macro` | Ejecuta macro existente |
| `update_scene` | Actualiza escena |
| `execute_batch` | Ejecuta múltiples comandos |
| `add_items` | Añade items a actors |
| `plutonium_import` | Importa monsters desde 5etools |
| `sync_modules` | Sincroniza conocimiento de módulos |
| `analyze_module` | Analiza API de un módulo |
| `index_knowledge` | Persiste conocimiento en RAG |
| `play_animation` | Reproduce animación JB2A via Sequencer |
| `wire_animation` | Cablea animación a uso de habilidad |
| `verify_wiring` | Verifica cableado de animaciones |
| `create_macro` | Crea macros en el mundo |
| `create_region` | Crea regiones en la escena (V14) |
| `delete_entities` | Elimina entidades por ID |

## Módulos Soportados (conocimiento curado) — V14 only

| Módulo | Versión | Función |
|---|---|---|
| **MidiQOL** | 14.0.11 | Automatización de combate (hooks, workflow, macros) |
| **Sequencer** | 4.2.3 | Framework de animaciones (API encadenable) |
| **JB2A** | 0.9.1 | 2104 animaciones .webm (spells, weapons, conditions) |
| **DAE** | 14.0.12 | Dynamic Active Effects (buffs/debuffs) |
| **Active Auras** | 0.12.7 | Efectos por proximidad |
| **Times Up** | 13.1.9 | Duración de efectos |
| **Plutonium** | 2.16.2.v14 | Importación desde 5etools |
| **Tagger** | 1.6.0 | Etiquetado de tokens |
| **Automated Animations** | 7.0.16 | Auto-play de animaciones |
| **Chris's Premades** | 1.5.27 | Items pre-automatizados |

## Sources de Plutonium

| Source | Descripción |
|---|---|
| `MM` | Monster Manual (2014) |
| `XMM` | Monster Manual (2024) |
| `VGM` | Volo's Guide to Monsters |
| `MPMM` | Mordenkainen Presents |
| `ToB1-2023` | Tome of Beasts 1 |
