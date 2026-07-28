# Dorman Lakely's Critical Hit & Fumble Tables v1.4.0 — Críticos / Pifias

## API

```js
DormanLakely   // global (window.DormanLakely)
// Clases: EffectsManager, SaveManager, TableSelector, _TableImporter,
//         _MidiQolHooks, _ReimportTablesDialog
// publicMethods: api_promptForUpdate
```

## Hooks

- `init`, `ready`, `renderSettingsConfig`, `updateSetting`

## Uso

- Tablas de crítico (natural 20) y pifia (natural 1) por nivel (tiers 1-4) y tipo de ataque (melee / ranged / spell). Requiere Midi-QOL para detección automática. Configurable: auto-apply de condiciones/daño, usar nivel del actor, mensajes en chat.

## Dependencias

- `midi-qol` (requerido) + sistema dnd5e 5e.
