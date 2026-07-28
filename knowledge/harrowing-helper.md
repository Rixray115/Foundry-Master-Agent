# Harrowing Helper (harrowing-helper) — v1.0.17

## API Global

`game.harrowingHelper` — singleton instance.

## Funciones Principales

- `game.harrowingHelper.drawCard()` — Extrae una carta del mazo Harrowing y la muestra en chat.
- `game.harrowingHelper.readCard(cardId)` — Devuelve datos de una carta específica.
- `game.harrowingHelper.postReading(spread)` — Publica una tirada completa de Harrowing en formato formateado.

## Hooks

- `init`
- `ready`
- `createChatMessage`
- `renderChatMessageHTML`

## Uso

Módulo de interfaz para el mini-juego de cartas Harrowing en Pathfinder/5e. Lee datos de cartas del mazo Harrowing y publica mensajes de chat formateados con descripciones, alineamientos y significados. Compatible con Foundry 13+.

## Ejemplos

```javascript
// Dibujar una carta al azar
game.harrowingHelper.drawCard();

// Leer carta específica
const card = game.harrowingHelper.readCard("the-mute-hag");
console.log(card.name, card.alignment, card.meaning);

// Publicar tirada completa (3 cartas)
game.harrowingHelper.postReading(["the-mute-hag", "the-lost", "the-crows"]);
```
