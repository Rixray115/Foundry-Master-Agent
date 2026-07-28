/**
 * Eliminar entidades por ID (cleanup/rollback).
 *
 * Solo borra los IDs explícitamente listados. Para cada ID verifica existencia
 * y reporta qué se borró y qué no se encontró, para que el agente pueda auditar.
 *
 * args: {
 *   actors?:  string[],
 *   journals?: string[],
 *   tokens?:  Array<{ sceneId: string, id: string }>,
 *   macros?:  string[],
 *   scenes?:  string[],
 *   regions?: Array<{ sceneId: string, id: string }>,
 * }
 *
 * Returns: { deleted: {...}, notFound: {...} }
 */
export async function deleteEntities({
  actors = [],
  journals = [],
  tokens = [],
  macros = [],
  scenes = [],
  regions = [],
}) {
  const deleted = { actors: [], journals: [], tokens: [], macros: [], scenes: [], regions: [] };
  const notFound = { actors: [], journals: [], tokens: [], macros: [], scenes: [], regions: [] };

  for (const id of actors) {
    const a = game.actors.get(id);
    if (a) { await a.delete(); deleted.actors.push(id); } else notFound.actors.push(id);
  }

  for (const id of journals) {
    const j = game.journal.get(id);
    if (j) { await j.delete(); deleted.journals.push(id); } else notFound.journals.push(id);
  }

  for (const t of tokens) {
    // V14: scene.tokens is an EmbeddedCollection of TokenDocument, so .get() returns
    // the TokenDocument directly (not a Token). Delete the document itself.
    const scene = game.scenes.get(t.sceneId);
    const tok = scene?.tokens.get(t.id);
    if (tok) { await tok.delete(); deleted.tokens.push(t.id); } else notFound.tokens.push(t.id);
  }

  for (const id of macros) {
    const m = game.macros.get(id);
    if (m) { await m.delete(); deleted.macros.push(id); } else notFound.macros.push(id);
  }

  for (const id of scenes) {
    const s = game.scenes.get(id);
    if (s) { await s.delete(); deleted.scenes.push(id); } else notFound.scenes.push(id);
  }

  for (const r of regions) {
    const scene = game.scenes.get(r.sceneId);
    const region = scene?.regions.get(r.id);
    if (region) {
      await scene.deleteEmbeddedDocuments("Region", [r.id]);
      deleted.regions.push(r.id);
    } else notFound.regions.push(r.id);
  }

  return { deleted, notFound };
}
