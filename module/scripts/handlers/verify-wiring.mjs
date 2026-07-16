/**
 * verify_wiring — Lee el estado de cableado de animaciones del port (handler wire_animation).
 *
 * Permite confirmar en una sola llamada que el hook está registrado, qué mapeos existen y
 * los contadores acumulados, sin tener que re-derivar nada en la sesión.
 *
 * También demuestra explícitamente que activity.macroData NO es el campo de cableado:
 * para cada item con actividad, onUseMacroFieldEmpty=true indica que ninguna activity tiene
 * macroData.command set (el cableado vive en el hook, no en ese campo inexistente).
 *
 * args: { actorId?: string }
 * Returns: { ok, wired, mappingCount, mapping, counters, items }
 */
export async function verifyWiring({ actorId } = {}) {
  const STATE = globalThis.__piBridgeAnim || { wired: false, map: {}, counters: {} };
  const map = STATE.map || {};
  const items = [];

  if (actorId) {
    const actor = game.actors.get(actorId);
    if (actor) {
      for (const it of actor.items) {
        const acts = Array.from(it.system.activities?.values?.() ?? []);
        items.push({
          name: it.name,
          type: it.type,
          activityCount: acts.length,
          onUseMacroFieldEmpty: acts.every((a) => !(a.macroData && a.macroData.command)),
        });
      }
    }
  }

  return {
    ok: true,
    wired: STATE.wired,
    mappingCount: Object.keys(map).length,
    mapping: map,
    counters: STATE.counters,
    items,
  };
}
