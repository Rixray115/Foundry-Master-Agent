# Dfreds Convenient Effects v9.2.1 — Efectos de Estado Centralizados

## API Global

```js
dfreds                    // global (game.dfreds)
game.dfreds.effectHandler // ConvenientEffects API (clase ConvenientEffectsV22)
```

## Funciones Principales

```js
// Aplicar un efecto por nombre a un actor/token
await game.dfreds.effectHandler.addEffect({ effectName: "Bless", uuid: token.document.uuid });

// Quitar efecto
await game.dfreds.effectHandler.removeEffect({ effectName: "Bless", uuid });

// ¿Está aplicado?
game.dfreds.effectHandler.hasEffectApplied("Bless", token.document.uuid);

// Alternar
await game.dfreds.effectHandler.toggleEffect({ effectName: "Bless", uuid });
```

## Hooks

- `convenientEffects.ready` — API lista
- `convenientEffects.preAddEffect` / `convenientEffects.postAddEffect` — interceptar aplicación

## Integración

- Backend de efectos para **DAE** y **AutoAnimations** (activa animaciones de estado vía `wire_animation`).
- Catálogo de efectos editable en UI (requiere `lib-dfreds-ui-extender`).

## Dependencias

- socketlib, libWrapper
- lib-dfreds-ui-extender (UI del catálogo)
