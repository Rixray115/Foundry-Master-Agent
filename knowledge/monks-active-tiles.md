# Monk's Active Tile Triggers (monks-active-tiles) - v14.01
## API Global
- `MonkActiveTiles` - Objeto global con métodos de control.
- `TriggerConfig` - Configuración de disparadores por tile.

## Funciones Principales
- `MonkActiveTiles.runTrigger(tile, triggerName)` - Ejecuta un trigger específico en un tile.
- `MonkActiveTiles.getTriggers(tile)` - Obtiene todos los triggers configurados en un tile.
- `MonkActiveTiles.clearTriggers(tile)` - Limpia triggers de un tile.

## Hooks
- `monks-active-tiles.createTile` - Al crear un tile con triggers.
- `monks-active-tiles.updateTile` - Al actualizar triggers de un tile.
- `monks-active-tiles.deleteTile` - Al eliminar un tile con triggers.
- `monks-active-tiles.ready` - Cuando el módulo está listo.
- `monks-active-tiles.init` - Durante inicialización.

## Uso
Configura triggers en tiles del escenario: click, paso, visión, o automático. Soporta macros, sonidos, cambios de escena, y más.

## Ejemplos
```javascript
// Ejecutar trigger manualmente
MonkActiveTiles.runTrigger(tile, "myTrigger");

// Escuchar creación de tile
Hooks.on("monks-active-tiles.createTile", (tile, triggers) => {
  console.log("Tile creado con triggers:", triggers);
});

// Obtener triggers de un tile
const triggers = MonkActiveTiles.getTriggers(tile);
```

## Dependencias
- Foundry VTT v14+
- Monk's Suite (recomendado)