# PSFX v0.15.0 — Librería de SFX para Sequencer

## API

```js
// Registra .ogg en la DB de Sequencer bajo "psfx.*"
Sequencer.Database.getEntry("psfx.<nombre>");
```

## Hooks

- `sequencer.ready` — PSFX registra sus sons al cargar Sequencer

## Uso

- Biblioteca de efectos de sonido listos para `play_animation` / efectos de audio en encuentros.
- Acceso: `Sequencer.Database.getEntry("psfx.explosion")` dentro de un effect de Sequencer.

## Dependencias

- sequencer (requiere que Sequencer esté activo)
