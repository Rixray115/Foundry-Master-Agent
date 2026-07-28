# Item Piles (item-piles) — v3.3.4

## API Global

`game.ItemPiles` — acceso completo a la API del módulo.

## Funciones Principales

- `game.ItemPiles.API.openContainer(token)` — Abre un contenedor interactivo.
- `game.ItemPiles.API.takeItem(token, itemId, quantity)` — Toma ítems de una pila.
- `game.ItemPiles.API.addItem(token, itemData, quantity)` — Agrega ítems a una pila.
- `game.ItemPiles.API.transferItem(sourceToken, targetToken, itemId, quantity)` — Transfiere ítems entre tokens.
- `game.ItemPiles.API.setItemPile(token, config)` — Configura un token como pila de ítems.
- `game.ItemPiles.API.turnIntoMerchant(token, config)` — Convierte un token en mercader.
- `game.ItemPiles.API.destroyPile(token)` — Elimina la pila del token.

## Hooks

- `dropCanvasData` — Intercepta drops en el canvas para crear pilas.
- `renderTokenHUD` — Agrega opciones de pila al HUD del token.
- `updateActor` — Sincroniza cambios de actor con la pila visual.
- `updateItem` — Actualiza ítems dentro de contenedores.
- `updateToken` — Refleja cambios de token en la pila.
- `init` — Inicializa configuraciones del módulo.
- `ready` — Finaliza carga de datos y pilas existentes.

## Uso

Item Piles convierte tokens en contenedores interactivos (cofres, montones, cadáveres). Los jugadores pueden arrastrar ítems del inventario al token para depositarlos, o hacer clic derecho para abrir la UI de la pila. Soporta mercaderes con trueques automáticos y monedas. Los ítems se renderizan visualmente sobre el token.

## Ejemplos

```javascript
// Crear un cofre con ítems
await game.ItemPiles.API.setItemPile(token, {
  items: [{ name: "Poción de Vida", quantity: 3 }],
  pile: true
});

// Abrir pila como mercader
await game.ItemPiles.API.turnIntoMerchant(token, {
  merchant: true,
  trades: true,
  currency: { gp: 100 }
});

// Transferir ítem entre tokens
await game.ItemPiles.API.transferItem(sourceToken, targetToken, "item123", 2);

// Tomar ítem de una pila
await game.ItemPiles.API.takeItem(token, "item456", 1);
```
