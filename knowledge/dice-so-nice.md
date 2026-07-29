# Dice So Nice v6.2.9 — Dados 3D

## API Global

```js
game.dice3d
```

## Funciones Principales

```js
// Forzar visualización 3D de un roll para usuarios concretos
await game.dice3d.showForRoll(roll, [userId], { broadcast: true });

// Leer configuración de tema
game.settings.get("dice-so-nice", "settings");
```

## Hooks

- `diceSoNiceRollStart` / `diceSoNiceRollComplete` — lifecycle del lanzamiento 3D
- `diceSoNiceRollShown` — tras pintar en pantalla

## Dependencias

- socketlib (sincroniza la animación entre clientes)
