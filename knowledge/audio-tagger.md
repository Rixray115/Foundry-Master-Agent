# Audio Tagger v1.5.4 — Etiquetado de Audio

## API

```js
const API = game.modules.get('audio-tagger').api;

API.getTags();                    // todas las etiquetas
API.getTag(uuid);
API.createTag(data);
API.updateTag(uuid, updates);
API.deleteTag(uuid);
API.assignTag(doc, tagId);        // asignar a playlist/sound
API.unassignTag(doc, tagId);
API.getAssignedTags(doc);
API.getDocumentsWithTag(tagId);   // buscar por etiqueta
API.toggleWizard();
```

## Hooks

- `audioTaggerTagUpdated`
- `audioTaggerTagDeleted`

## Uso

- Gestión de etiquetas para playlists/sons: smart playlists, búsqueda, hotkeys de reproducción (O/L/K).

## Dependencias

- Ninguna (standalone)
