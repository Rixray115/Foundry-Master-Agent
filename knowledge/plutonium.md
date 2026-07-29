# Plutonium v2.15.0 — Importación desde 5etools

## API Global

```js
game.plutonium                          // API principal
game.plutonium.importer                 // Namespace de importers
game.plutonium.importer.creature        // Import de monsters/NPCs
game.plutonium.importer.spell           // Import de hechizos
game.plutonium.importer.item            // Import de items
```

## Importar un Creature (Monster/NPC)

```js
// 1. Cargar datos del bestiario desde los archivos bundled
const fileName = `bestiary-${source.toLowerCase()}.json`;
const url = `${window.location.origin}/modules/plutonium/data/bestiary/${fileName}`;
const response = await fetch(url);
const data = await response.json();

// 2. Buscar el creature por nombre
const entry = data.monster.find(m => m.name === name && m.source === source);

// 3. Importar via Plutonium
const result = await game.plutonium.importer.creature.pImportEntry(entry, {
  isTemp: false,    // false = crear actor permanente, true = temporal
  packId: null,     // ID de compendium (opcional)
  actor: null,      // Actor existente (opcional, para importar a un actor)
});
```

## Parámetros de pImportEntry

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `entry` | object | (requerido) | Datos del creature en formato 5etools |
| `isTemp` | boolean | false | Actor temporal (no se guarda) |
| `packId` | string | null | ID de compendium destino |
| `actor` | Actor | null | Actor existente para importar encima |
| `actorMultiImportHelper` | object | null | Helper para multi-import |
| `availableProficiencyManager` | object | null | Manager de proficiencias |

## Sources Comunes

| Source | Archivo | Contenido |
|---|---|---|
| `MM` | bestiary-mm.json | Monster Manual (2014) |
| `XMM` | bestiary-xmm.json | Monster Manual (2024) |
| `VGM` | bestiary-vgm.json | Volo's Guide to Monsters |
| `MPMM` | bestiary-mpmm.json | Mordenkainen Presents: Monsters of the Multiverse |
| `ToB1-2023` | bestiary-tob1-2023.json | Tome of Beasts 1 (2023) |

## Homebrew Sources

Plutonium puede importar homebrew desde archivos JSON colocados en:
```
Data/modules/plutonium/data/bestiary/bestiary-{source}.json
```

El repositorio oficial de homebrew 5etools está en:
```
https://github.com/TheGiddyLimit/homebrew/tree/master/collection
```

### Amellwind's Monster Hunter

| Source | Archivo | Contenido |
|---|---|---|
| `MHMM` | bestiary-mhmm.json | Monster Hunter Monster Manual — 294 criaturas (Rathalos, Nergigante, Zinogre, etc.) |
| `AGMH` | bestiary-agmh.json | Amellwind's Guide to Monster Hunting — clases, items, 7 criaturas |

**Instalación:**
```bash
# Descargar e instalar el bestiario MH
curl -sL "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/collection/Amellwind%3B%20Monster%20Hunter%20Monster%20Manual.json" \
  -o "Data/modules/plutonium/data/bestiary/bestiary-mhmm.json"
```

**Importar criaturas:**
```js
// Via plutonium_import handler
foundry_execute("plutonium_import", {
  creatures: [
    { name: "Rathalos", source: "MHMM" },
    { name: "Nergigante", source: "MHMM" }
  ]
})
```

⚠️ **Token art NO incluido**: Las importaciones homebrew NO incluyen imágenes de token. Los actores tendrán el portrait de 5e.tools (si existe) pero los tokens en canvas usarán `mystery-man.svg`. Usar `Tokenizer2.tokenizeBatch(actors)` para generar tokens con frames desde los portraits disponibles.

> El arte oficial de tokens Monster Hunter es un producto separado de Patreon (Amellwind).

## Otros Importers

### Hechizos
```js
game.plutonium.importer.spell.pImportEntry(spellEntry, { isTemp: false });
```

### Items (Unarmed Strike)
```js
game.plutonium.importer.item.pImportUnarmedStrike(actor);
```

## API Adicional

```js
// Abrir el importer UI
game.plutonium.importer.pOpen();

// Importar todo
game.plutonium.importer.pImportAll();

// Obtener un importer específico
const importer = await game.plutonium.importer.pGetImporter({ page: "bestiary.html" });

// Crear token con nombre
game.plutonium.moduleMacro.createNamedToken({ ... });

// Importar a tokens seleccionados
game.plutonium.moduleMacro.importToSelectedTokens();
```

## Utilidades

```js
// Crear carpetas
game.plutonium.util.folders.pCreateFoldersGetId(name, type);

// Guardar imagen al servidor
game.plutonium.util.requests.pSaveImageToServerAndGetUrl(url);

// Operaciones de imagen
game.plutonium.util.image.pLoadImage(url);
game.plutonium.util.image.pDrawTextGetBlob(text, options);
```

## Hooks

```js
// Plutonium fired an event
game.plutonium.hooks.on("eventName", callback);
game.plutonium.hooks.off("eventName", callback);
```

## Addon: Plutonium Automation (v0.8.2)

El addon `plutonium-addon-automation` añade:
- DAE macros automáticas a items importados
- Configuración MidiQOL en actions/traits
- Active Effects para condiciones
- Integración con Automated Animations

## Ejemplo: Importar 3 Orcs y 1 Priest

```js
const creatures = [
  { name: "Orc", source: "MM" },
  { name: "Orc", source: "MM" },
  { name: "Orc", source: "MM" },
  { name: "Priest", source: "XMM" },
];

for (const { name, source } of creatures) {
  const fileName = `bestiary-${source.toLowerCase()}.json`;
  const url = `${window.location.origin}/modules/plutonium/data/bestiary/${fileName}`;
  const data = await (await fetch(url)).json();
  const entry = data.monster.find(m => m.name === name && m.source === source);
  await game.plutonium.importer.creature.pImportEntry(entry, { isTemp: false });
}
```

## Dependencias

- Ninguna (módulo standalone)
- Recomendado: plutonium-addon-automation
