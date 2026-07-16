# Tokenizer 2 v1.2.3 — Arte de Tokens

## API Global

```js
Tokenizer2
```

## Funciones Principales

```js
// Obtener arte procesado de un token (recortado/mascarado/animado)
Tokenizer2.getArtwork(token);

// Buscar arte por nombre
Tokenizer2.findArtwork("Orc");
```

## Hooks

- `tokenizer-2.registerSettings` — añadir ajustes
- `tokenizer-2.registerFilters` / `registerFrames` / `registerAnimations` — extender catálogo

## Uso

- Recorta, enmascara, aplica frames y anima retratos de token desde la UI del token.

## Dependencias

- Ninguna (standalone)
