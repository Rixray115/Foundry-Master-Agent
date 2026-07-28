# Playbook — Recetas verificadas para FoundryVTT + módulos

> Este documento contiene instrucciones probadas y verificadas para realizar
> tareas comunes con FoundryVTT V13 y sus módulos. Cada receta incluye
> el patrón correcto, pitfalls conocidos, y ejemplos funcionales.
>
> **Propósito**: Que el agente (o cualquier usuario) sepa hacer estas cosas
> correctamente sin tener que descubrir los bugs por trial and error.

---

## 1. Importar monsters desde 5etools (Plutonium)

### Patrón correcto

```
foundry_execute("plutonium_import", {
  creatures: [
    { name: "Orc", source: "MM" },
    { name: "Priest", source: "XMM" }
  ]
})
```

### Sources válidas

| Source | Descripción |
|---|---|
| `MM` | Monster Manual (2014) |
| `XMM` | Monster Manual (2024) |
| `VGM` | Volo's Guide to Monsters |
| `MPMM` | Mordenkainen Presents |
| `ToB1-2023` | Tome of Beasts 1 |

### Resultado

```json
{
  "results": [{
    "name": "Orc",
    "source": "MM",
    "actorId": "qfseZg4ENR1ZrfXt",
    "items": ["Greataxe", "Javelin (Melee)", "Javelin (Ranged)", "Aggressive", "Hide Armor"],
    "success": true
  }]
}
```

### Notas
- Plutonium importa stats, acciones, traits, items y sprites completos
- Es **lento** (puede tardar 10-30s por creature) — el relay tiene timeout de 120s
- El `actorId` retornado se usa para `place_tokens` y `set_animation_effect`
- Preferir `plutonium_import` sobre `create_actors` para monsters canon

---

## 2. Colocar tokens en la escena

### Patrón correcto

```
foundry_execute("place_tokens", {
  tokens: [
    { actorId: "qfseZg4ENR1ZrfXt", x: 1000, y: 1000 },
    { actorId: "otroActorId", x: 1500, y: 1200 }
  ]
})
```

### Notas
- `x` e `y` son coordenadas en píxeles del canvas
- Si no se especifica `sceneId`, usa la escena activa
- Retorna `tokenIds` array y `sceneId`

---

## 3. Animaciones con Sequencer + JB2A

### ⚠️ Pitfalls críticos (aprendidos por trial and error)

1. **`.name()` debe llamarse ANTES de `.persist()`** — si no, el effect no tiene
   nombre y no puede ser detenido con `endEffects({ name })`

2. **`.attachTo(token)` para que siga al token** — `.atLocation(token)` deja la
   animación en posición fija

3. **`Sequencer.EffectManager.endEffects({ name })`** detiene por nombre —
   `endAllEffects()` detiene todo

### Patrón correcto: animación simple

```
foundry_execute("play_animation", {
  tokenId: "an3n71f6nNE9VGYc",
  file: "modules/JB2A_DnD5e/Library/Generic/Template/Circle/Aura/AuraLoop01_01_Regular_BluePurple_500x500.webm",
  tint: "#cc0000",
  scale: 2,
  persist: true,
  attachTo: true,
  name: "mi-animacion"
})
```

### Patrón correcto: detener animación

```
foundry_execute("play_animation", { stop: true })                    // detener todo
foundry_execute("play_animation", { stop: true, name: "mi-animacion" }) // detener por nombre
```

### JB2A: paths de assets comunes

| Tipo | Path | Uso |
|---|---|---|
| Aura loop | `Library/Generic/Template/Circle/Aura/AuraLoop01_01_Regular_BluePurple_500x500.webm` | Auras persistentes |
| Electricidad | `Library/Generic/Lightning/StaticElectricity_02_Regular_Blue_400x400.webm` | Efectos eléctricos |
| Lightning ball | `Library/Generic/Lightning/LightningBall_01_Regular_Blue_400x400.webm` | Orbes de relámpago |
| Electric arc | `Library/Generic/Lightning/ElectricArc01_01_Regular_Blue_1600x500.webm` | Arcos eléctricos |

> Los assets JB2A son azules por defecto — usar `tint` para cambiar el color.
> Ej: `tint: "#cc0000"` para rojo carmesí, `tint: "#ff3300"` para rojo brillante.

### Escala

| Scale | Radio aproximado | Nota |
|---|---|---|
| 1 | 5ft | Tamaño del asset original |
| 2 | 10ft | Doble del original |
| 3 | 15ft | Triple del original |

---

## 4. Animaciones controladas por Active Effects (toggle on/off)

### Concepto

Un Active Effect en el actor almacena la config de animación en sus flags.
Los hooks del pi-bridge detectan cuando el effect se activa/desactiva y
reproducen/detienen las animaciones automáticamente.

### Patrón correcto: múltiples animaciones en un solo effect

```
foundry_execute("set_animation_effect", {
  actorId: "qfseZg4ENR1ZrfXt",
  name: "Aura Carmesí Electrificada",
  animations: [
    {
      file: "modules/JB2A_DnD5e/Library/Generic/Template/Circle/Aura/AuraLoop01_01_Regular_BluePurple_500x500.webm",
      tint: "#cc0000",
      scale: 2,
      persist: true,
      attachTo: true
    },
    {
      file: "modules/JB2A_DnD5e/Library/Generic/Lightning/StaticElectricity_02_Regular_Blue_400x400.webm",
      tint: "#ff3300",
      scale: 1.5,
      persist: true,
      attachTo: true
    }
  ]
})
```

### Cómo funciona

1. El handler crea un Active Effect con `flags.pi-bridge.animations = [...]`
2. Hook `createActiveEffect` → reproduce todas las animaciones
3. Hook `updateActiveEffect` (toggle disabled) → reproduce o detiene
4. Hook `deleteActiveEffect` → detiene todas
5. Hook `createToken` → reproduce automáticamente si el actor tiene effects activos

### Ventajas

- **Toggle on/off** desde la UI de Foundry (ficha del actor → pestaña Effects)
- **Múltiples animaciones** controladas por un solo toggle
- **Auto-play** al colocar un token nuevo del actor
- **Auto-cleanup** al borrar el token (Sequencer + attachTo)
- La config viaja con el actor, no con el token

### Estructura interna de flags

```json
{
  "flags": {
    "pi-bridge": {
      "animations": [
        {
          "file": "modules/JB2A_DnD5e/...",
          "tint": "#cc0000",
          "scale": 2,
          "persist": true,
          "attachTo": true,
          "belowTokens": true,
          "name": "anim-<actorId>-<effectName>-0"
        }
      ]
    }
  }
}
```

---

## 5. GraphRAG — Cómo investigar módulos

### Dos tipos de búsqueda

| Tool | Tipo | Cuándo usar | Ejemplo |
|---|---|---|---|
| `foundry_search_docs` | Semántico | "Cómo usar X" | "Sequencer effect animation play" |
| `foundry_query_graph` | Estructural | "Qué llama a X" | "What calls rollDamage?" |

### Patrón: investigar antes de actuar

```
1. foundry_query_graph("What classes and methods does <module> have?")
   → entiende la estructura (call graph, jerarquía)

2. foundry_search_docs("<specific API usage>", { module: "<module>" })
   → encuentra la documentación de cada método

3. Combina: estructura del grafo + documentación del RAG
```

### Ejemplo real: entender Sequencer

```
foundry_query_graph("Sequencer EffectSection file tint scale attachTo play")
→ revela: EffectSection → HasFiles, HasTint, HasScale, HasLocation (mixins)

foundry_search_docs("attachTo token follow movement", { module: "sequencer" })
→ revela: "A smart method that can take a reference to an object to attach an effect to"
```

---

## 6. Añadir items a actors

### Patrón correcto

```
foundry_execute("add_items", {
  items: [
    {
      actorId: "qfseZg4ENR1ZrfXt",
      name: "Aura Carmesí",
      type: "feat",
      description: "Aura roja electrificada que daña a enemigos cercanos"
    }
  ]
})
```

### Types válidos

`weapon`, `feat`, `equipment`, `consumable`, `spell`, `tool`, `loot`, `class`, `background`, `race`, `subclass`

---

## 7. Crear entradas de diario

### Patrón correcto

```
foundry_execute("create_journal", {
  entries: [
    {
      name: "Encuentro: Orco Electrificado",
      content: "<h2>Orco</h2><p>Aura roja + electricidad persistente.</p>"
    }
  ]
})
```

---

## 8. Ejecutar múltiples comandos en batch

### Patrón correcto

```
foundry_execute("execute_batch", {
  commands: [
    { command: "plutonium_import", args: { creatures: [{ name: "Orc", source: "MM" }] } },
    { command: "create_journal", args: { entries: [{ name: "Encuentro", content: "..." }] } }
  ]
})
```

### Notas
- Los comandos se ejecutan en secuencia
- Útil para reducir round-trips cuando se crean múltiples cosas

---

## 9. Auto-learning de módulos nuevos

### Flujo

```
1. foundry_execute("sync_modules")
   → detecta módulos desconocidos o versiones distintas

2. foundry_execute("analyze_module", { moduleId: "nuevo-modulo" })
   → extrae: globals, hooks, classes, publicMethods, readme

3. Sintetizar conocimiento en markdown

4. foundry_execute("index_knowledge", { module: "nuevo-modulo", content: "<markdown>" })
   → persiste en RAG para futuras sesiones
```

---

## 10. Active Auras — Efectos por proximidad

### Configuración de un aura

Crear un Active Effect con estos flags:

```json
{
  "flags": {
    "ActiveAuras": {
      "isAura": true,
      "aura": "Enemies",
      "radius": 10,
      "alignment": "enemy"
    }
  }
}
```

### Flags

| Flag | Valores | Descripción |
|---|---|---|
| `isAura` | `true` | Marca el efecto como aura |
| `aura` | `"Allies"`, `"Enemies"`, `"All"` | Quién se ve afectado |
| `radius` | número (ft) | Radio del aura |
| `alignment` | `"friend"`, `"enemy"`, `"neutral"` | Alineación del afectado |

### Cadena interna (descubierta via Graphify)

```
Token se mueve
  → AAHooks.updateTokenHook()
    → CollateAuras()
      → AAMeasure → getDistance()
        → ActiveAuras.UpdateToken()
          → aplica/remueve Active Effect
```

---

## 11. DAE — Dynamic Active Effects

### Campos comunes

```
system.abilities.str.bonuses.check   +1d4    // Bonificador a checks de STR
system.attributes.ac.bonus            +1      // +1 a AC
system.bonuses.weapon.damage          +1d4    // +1d4 a weapon damage
```

### Llamar macros desde effects

```
@Call[macroName,1]    // Llamar macro al aplicar efecto
@Call[macroName,0]    // Llamar macro al remover efecto
```

---

## 12. MidiQOL — Saving throws y combate

### API útil

```js
MidiDAEEval.findNearby(token, range)        // tokens cercanos
MidiDAEEval.getDistance(token, target)       // distancia en grid
MidiDAEEval.hasCondition(actor, "poisoned")  // ¿tiene condición?
MidiQOL.addEffect({ actor, effectName: "Stunned" })  // aplicar condición
```

### Workflow hooks para saves

| Hook | Cuándo |
|---|---|
| `midi-qol.preCheckSaves` | Antes de salvaciones |
| `midi-qol.postCheckSaves` | Después de salvaciones |
| `midi-qol.postActiveEffects` | Después de aplicar efectos |

### Workflow object

```js
workflow.targets      // Set de tokens target
workflow.saves        // Set de targets que pasaron el save
workflow.failedSaves  // Set de targets que fallaron el save
workflow.hitTargets   // Set de targets acertados
```

---

## 13. Patrones completos: Encuentro con animación

### Receta: Orco con aura roja electrificada

```
Paso 1: Importar
  foundry_execute("plutonium_import", {
    creatures: [{ name: "Orc", source: "MM" }]
  })
  → actorId

Paso 2: Colocar token
  foundry_execute("place_tokens", {
    tokens: [{ actorId, x: 1000, y: 1000 }]
  })
  → tokenId

Paso 3: Crear effect con animaciones
  foundry_execute("set_animation_effect", {
    actorId,
    name: "Aura Carmesí Electrificada",
    animations: [
      { file: ".../AuraLoop01_..._500x500.webm", tint: "#cc0000", scale: 2, persist: true, attachTo: true },
      { file: ".../StaticElectricity_02_..._400x400.webm", tint: "#ff3300", scale: 1.5, persist: true, attachTo: true }
    ]
  })

Paso 4: Crear diario
  foundry_execute("create_journal", {
    entries: [{ name: "Encuentro", content: "..." }]
  })
```

### Resultado
- Token del Orco en la escena
- Aura roja + electricidad reproduciéndose
- Toggle on/off desde la ficha del actor
- Auto-play al colocar nuevos tokens del mismo actor

---

## 14. Lecciones aprendidas (pitfalls)

### Sequencer

| Pitfall | Síntoma | Solución |
|---|---|---|
| No llamar `.name()` antes de `.persist()` | No se puede detener la animación por nombre | Siempre `.name(x)` antes de `.persist(true)` |
| Usar `.atLocation()` en vez de `.attachTo()` | La animación no sigue al token | Usar `.attachTo(token)` para seguimiento |
| `endEffects` vs `endEffect` | Error al detener | `endEffects({ name })` para filtrar por nombre |

### Active Effects en V13

| Pitfall | Síntoma | Solución |
|---|---|---|
| Hook `updateActiveEffect` no dispara | Toggle no funciona | Verificar que `changes.disabled !== undefined` |
| Effect creado pero animación no reproduce | Sin animación al crear | Hook `createActiveEffect` debe buscar tokens del actor en canvas |
| Token nuevo sin animación | Animación no auto-play | Hook `createToken` con `setTimeout(500)` para esperar canvas ready |

### Plutonium

| Pitfall | Síntoma | Solución |
|---|---|---|
| Timeout en import | Error 504 | Relay timeout debe ser 120s+ |
| Source incorrecta | "Creature not found" | Verificar source válida (MM, XMM, VGM, etc.) |

---

## 15. Comandos disponibles (referencia rápida)

| Comando | Descripción | Args requeridos |
|---|---|---|
| `ping` | Test de conectividad | — |
| `list_active_modules` | Lista módulos activos | — |
| `create_actors` | Crea actors | `actors: [{ name, type }]` |
| `place_tokens` | Coloca tokens | `tokens: [{ actorId }]` |
| `create_journal` | Crea diario | `entries: [{ name }]` |
| `run_macro` | Ejecuta macro | `name` |
| `update_scene` | Actualiza escena | `data` |
| `execute_batch` | Batch de comandos | `commands: [{ command }]` |
| `add_items` | Añade items | `items: [{ actorId, name, type }]` |
| `plutonium_import` | Importa de 5etools | `creatures: [{ name }]` |
| `sync_modules` | Sincroniza módulos | — |
| `analyze_module` | Analiza un módulo | `moduleId` |
| `index_knowledge` | Persiste en RAG | `module, content` |
| `play_animation` | Reproduce animación | `tokenId, file` o `stop` |
| `set_animation_effect` | Crea effect de animación | `actorId, name, animations` o `file` |
