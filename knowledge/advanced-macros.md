# Advanced Macros v2.4.0 — Macros con Argumentos

## API

```js
AdvancedMacro          // clase
AdvancedMacro.fromMacro(macro);  // envuelve una macro
macro.getArgs();                 // parsea argumentos pasados
```

## Hooks

- `advanced-macros.*` (registerArgTypes, preRunMacro)

## Uso

- Permite pasar argumentos a macros y drag-drop de macros con params.
- Complementa `run_macro`: `run_macro` con `args[]` se resuelve mejor si Advanced Macros está activo.

## Dependencias

- Ninguna (standalone)
