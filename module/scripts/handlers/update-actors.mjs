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
 * Returns: { updatedIds: string[], actors: [{id, name, ok, error}] }
 *
 * IMPORTANTE: Foundry puede RECHAZAR SILENCIOSAMENTE un `actor.update` si
 * algún campo tiene un tipo o ruta inválida en `systemData` (p.ej.
 * `attributes.movement.walk` debe ser un NÚMERO, no {value:N};
 * `traits.dr.value` es un Set y conviene pasarlo en un update aparte;
 * combinar ciertos campos en un mismo merge puede fallar). Por eso no basta
 * con que `actor.update` no lance excepción: comparamos el actor antes/después
 * para detectar si realmente se aplicó el cambio.
 */
export async function updateActors({ updates }) {
  const results = [];

  for (const u of updates) {
    const actor = game.actors.get(u.actorId);
    if (!actor) {
      results.push({ id: u.actorId, ok: false, error: `Actor no encontrado: ${u.actorId}` });
      continue;
    }

    // Construir datos de update — systemData va bajo "system", data va en raiz
    const patch = {};
    if (u.data) Object.assign(patch, u.data);
    if (u.systemData) patch.system = u.systemData;

    // Snapshot del estado actual para detectar si el update realmente aplicó
    const before = JSON.stringify(actor.toObject());

    let updated;
    try {
      updated = await actor.update(patch);
    } catch (err) {
      results.push({
        id: u.actorId,
        ok: false,
        error: `actor.update lanzó excepción: ${err.message}`,
      });
      continue;
    }

    const after = JSON.stringify(actor.toObject());

    if (!updated || before === after) {
      results.push({
        id: u.actorId,
        ok: false,
        error:
          "el update NO aplicó cambios (Foundry lo rechazó silenciosamente). " +
          "Revisa tipos/rutas en systemData: movement.walk debe ser número; " +
          "traits.dr.value es un Set (pasar en update aparte); evita combinar " +
          "Set/ac en un mismo merge de system.",
      });
      continue;
    }

    results.push({ id: u.actorId, ok: true, name: actor.name });
  }

  return {
    updatedIds: results.filter((r) => r.ok).map((r) => r.id),
    actors: results.map((r) => ({ id: r.id, name: r.name ?? "unknown", ok: r.ok, error: r.error })),
  };
}
