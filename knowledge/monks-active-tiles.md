# Monk's Active Tile Triggers — Triggers en Teselas

## API

```js
CONFIG.MonksActiveTiles  // registro de triggers/acciones
// Configuración vía UI de la tesela (sección "Active Tiles")
```

## Triggers (eventos)

- Token entra / sale / se mueve dentro de la tesela
- Click / doble-click en la tesela

## Acciones

- Ejecutar macro, mover token, toggle tesela, play sound, mostrar/ocultar drawing, cambiar escena, roll table

## Hooks

- `monks-active-tiles.*` (preTrigger, postTrigger, registerTriggers, registerActions)

## Dependencias

- socketlib, libWrapper
