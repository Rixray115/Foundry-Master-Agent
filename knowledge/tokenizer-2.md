# Tokenizer 2 v1.2.5 — Arte de Tokens

## API Global

```js
Tokenizer2
```

## Funciones Principales

```js
// Tokenizar un actor (genera token desde su portrait)
await Tokenizer2.tokenize(actor);

// Tokenizar múltiples actors en batch
await Tokenizer2.tokenizeBatch([actor1, actor2, ...]);

// Abrir el editor para una imagen
Tokenizer2.openEditor(imgPath);

// Abrir editor standalone
Tokenizer2.openEditorStandalone(imgPath);

// Obtener arte procesado de un token
Tokenizer2.getArtwork(token);

// Buscar arte por nombre
Tokenizer2.findArtwork("Orc");
```

## Uso Programático

Después de importar criaturas via Plutonium, los tokens nuevos no tienen arte (muestran `mystery-man.svg`). Usar Tokenizer para generar tokens con frames:

```js
// 1. Obtener los actors recién importados
const actors = ["Rathalos", "Nergigante"].map(n => game.actors.getName(n)).filter(Boolean);

// 2. Tokenizar en batch
await Tokenizer2.tokenizeBatch(actors);

// 3. Sincronizar tokens en canvas con el nuevo prototypeToken
for (const token of canvas.tokens.placeables) {
  const protoImg = token.actor?.prototypeToken?.texture?.src;
  if (protoImg) {
    await token.document.update({ texture: { src: protoImg } });
  }
}
```

Los tokens generados se guardan en `tokenizer/npc-images/Token.{Name}.webp`.

⚠️ **Requiere imagen fuente**: Tokenizer aplica frames/máscaras a la imagen portrait del actor. Si el actor no tiene portrait (homebrew sin arte), el resultado será un token con el portrait genérico de Foundry. El arte de criaturas homebrew (ej. Monster Hunter) debe obtenerse por separado.

## Hooks

- `tokenizer-2.registerSettings` — añadir ajustes
- `tokenizer-2.registerFilters` / `registerFrames` / `registerAnimations` — extender catálogo

## Uso

- Recorta, enmascara, aplica frames y anima retratos de token desde la UI del token.
- API programática para batch processing post-import.

## Dependencias

- Ninguna (standalone)
