# Itemacro (itemacro) — v3.0.1

## API Global

`game.itemacro` — namespace principal.  
`item.executeMacro(...args)` — ejecuta macro guardada en el ítem.

## Funciones Principales

- `ItemMacro.configure()` — abre panel de configuración global.
- `ItemMacro.getMacro(item)` — devuelve el macro asociado al ítem.
- `ItemMacro.setMacro(item, macroData)` — asigna macro al ítem.
- `ItemMacro.runMacro(item, actor, args)` — ejecuta macro del ítem con contexto.

## Hooks

- `renderItemSheet` — inyecta editor de macro en la ficha del ítem.
- `getItemDirectoryEntryContext` — agrega opción "Ejecutar Macro" al menú contextual.
- `getHeaderControlsApplicationV2` — añade botón de macro en cabecera de ficha.
- `init` — registra configuraciones y parchea clase Item.
- `ready` — aplica configuraciones de usuario y hooks de UI.

## Uso

Itemacro permite guardar macros dentro de ítems (armas, objetos, habilidades). Al hacer clic en el ítem desde la ficha de personaje, hotbar o Token Action HUD, se ejecuta el macro asociado. Configurable desde Ajustes → Módulos → Itemacro: activar/desactivar triggers por sheet, hotbar y HUD.

## Ejemplos

```javascript
// Ejecutar macro de un ítem desde script
const item = actor.items.get("itemId");
item.executeMacro();

// Asignar macro a un ítem programáticamente
const macroData = {
  name: "Lanzar hechizo",
  command: `game.dice3d?.showForRoll(new Roll("1d20+5").roll());`,
  type: "script"
};
game.itemacro.setMacro(item, macroData);

// Escuchar ejecución de macro
Hooks.on("itemacro.execute", (item, actor, args) => {
  console.log(`Macro ejecutado para ${item.name}`);
});
```
