# Monk's TokenBar v14.01 — Barra de Tokens

## API

```js
MonksTokenBar         // global (window.MonksTokenBar)
MonksTokenBarAPI      // clase API pública (game.MonksTokenBar / api)
// Otras clases: TokenBar, ContestedRoll, SavingThrow, AssignXP, *App
```

## Hooks

- `controlToken`, `createToken`, `deleteToken`, `updateToken`, `updateCombat`, `renderCombatTracker`
- `renderTokenConfig`, `renderPrototypeTokenConfig`, `setupTileActions`
- Hooks propios: `monks-tokenbar.requestRoll`, `requestContested`, `updateRoll`, `updateContested`, `tokenBarUpdateRoll`

## Uso

- Barra con tokens de jugadores en escena; limitar movimiento (libre / ninguno / combate); diálogos de Saving Throw grupal, Contested Roll y Assign XP (automático al terminar el encuentro); lootables con Lootsheet; popout de roll cards.

## Dependencias

- Ninguna (standalone); opcional `lootsheetnpc5e` para lootables.
