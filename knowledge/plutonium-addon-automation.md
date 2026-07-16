# Plutonium Addon: Automation v0.8.4 — Automatización Midi

## API

```js
// Sin global; clases internas:
Api, DDBMacros, DDBEffectHelper, DataManager, Integrations
// API pública:
api_GetExpandedAddonData / api_pGetExpandedAddonData
```

## Hooks

- `midi-qol.RollComplete.${conditionItemUuid}`
- `AutomatedAnimations-WorkflowStart`

## Uso

- Al importar un documento con Plutonium, inyecta datos de automatización (efectos DAE, macros) desde D&D Beyond.
- Une Plutonium con el ecosistema Midi (DAE, MidiQOL, Times Up, Active-Auras; Chris's Premades opcional).

## Dependencias

- plutonium (requerido)
- dae, midi-qol, times-up (requeridos); active-auras, chris-premades (opcionales)

## Nota

- No está soportado por los autores de esos módulos; desactiva Plutonium para diagnosticar.
