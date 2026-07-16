/**
 * Actualizar Actors — actualiza campos específicos de actores existentes.
 *
 * args: {
 *   updates: Array<{
 *     actorId: string,    // ID del actor a actualizar
 *     systemData?: object, // datos del sistema (ej. dnd5e) para mergear
 *     data?: object       // campos de nivel superior (name, img, etc.)
 *   }>,
 * }
 *
 * Returns: { updatedIds: string[], actors: [{id, name}] }
 */
export async function updateActors({ updates }) {
  const results = [];

  for (const u of updates) {
    const actor = game.actors.get(u.actorId);
    if (!actor) {
      results.push({ id: u.actorId, ok: false, error: `Actor not found: ${u.actorId}` });
      continue;
    }

    // Construir datos de update — systemData va bajo "system", data va en raiz
    const patch = {};
    if (u.data) Object.assign(patch, u.data);
    if (u.systemData) patch.system = u.systemData;

    await actor.update(patch);

    results.push({ id: u.actorId, ok: true, name: actor.name });
  }

  return {
    updatedIds: results.filter((r) => r.ok).map((r) => r.id),
    actors: results.map((r) => ({ id: r.id, name: r.name ?? "unknown", ok: r.ok, error: r.error })),
  };
}
