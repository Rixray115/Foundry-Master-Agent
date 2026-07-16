/**
 * wire_animation — Enlaza animaciones JB2A a habilidades vía el hook dnd5e.postUseActivity.
 *
 * Sustituye el anti-patrón activity.macroData.command (que NO es un campo real de la
 * actividad en dnd5e 5.3.3 y nunca se ejecuta al usar la habilidad). El mecanismo fiable es
 * un único hook dnd5e.postUseActivity que mapea el nombre del item -> animación Sequencer
 * y además incrementa un contador para verificación.
 *
 * Para feats pasivos SIN actividad (p.ej. Azure Flame Mantle), se aplica un efecto persistente
 * de Sequencer directamente al token (no hay "uso" que enlazar).
 *
 * args: {
 *   animations?: Array<{
 *     itemName: string,        // nombre EXACTO del item (coincide con activity.item.name)
 *     file: string,            // ruta JB2A .webm
 *     tint?: string,           // hex, ej. "#66ccff"
 *     scale?: number,          // default 1
 *     persist?: boolean,       // default false
 *     loc?: "self" | "target", // default "target"
 *     counterKey?: string,     // default: slug del itemName
 *   }>,
 *   persistentAuras?: Array<{  // feats pasivos sin actividad
 *     tokenId: string,
 *     file: string,
 *     tint?: string,
 *     scale?: number,
 *     counterKey?: string,
 *   }>,
 *   defaultTargetTokenId?: string,  // fallback si no hay objetivo seleccionado
 * }
 *
 * Returns: { ok, hookRegistered, animations, persistentAuras, counters }
 */
export async function wireAnimation({ animations = [], persistentAuras = [], defaultTargetTokenId, actorId } = {}) {
  if (!game.modules.get("sequencer")?.active) {
    throw new Error("Sequencer no está activo.");
  }

  // Estado persistente de la sesión (namespaced para no colisionar con otros contadores).
  const STATE = (globalThis.__piBridgeAnim = globalThis.__piBridgeAnim || {
    wired: false, map: {}, counters: {}, defaultTargetTokenId: null,
  });
  STATE.defaultTargetTokenId = defaultTargetTokenId ?? STATE.defaultTargetTokenId;

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  for (const a of animations) {
    if (!a.itemName || !a.file) throw new Error("Cada animation requiere itemName y file.");
    const key = a.counterKey || slug(a.itemName);
    STATE.map[a.itemName] = {
      file: a.file,
      tint: a.tint ?? null,
      scale: a.scale ?? 1,
      persist: !!a.persist,
      loc: a.loc === "self" ? "self" : "target",
      key,
    };
  }

  // Persistir el mapeo en el actor para restauración automática tras reload.
  if (actorId) {
    const actor = game.actors.get(actorId);
    if (actor) await actor.setFlag("pi-bridge", "animations", animations);
  }

  // Registrar el hook UNA vez (idempotente).
  if (!STATE.wired) {
    STATE.wired = true;
    Hooks.on("dnd5e.postUseActivity", (activity, usageConfig, results) => {
      try {
        const name = activity && activity.item ? activity.item.name : null;
        const spec = STATE.map[name];
        if (!spec) return;
        const tok = resolveToken(spec.loc, activity.item.actor, STATE.defaultTargetTokenId);
        if (!tok) return;
        let seq = new Sequence().effect().file(spec.file).atLocation(tok);
        if (spec.scale && spec.scale !== 1) seq = seq.scale(spec.scale);
        if (spec.tint) seq = seq.tint(spec.tint);
        if (spec.persist) seq = seq.persist(true, { name: "pi-bridge-" + spec.key });
        else seq = seq.belowTokens();
        seq.play();
        STATE.counters[spec.key] = (STATE.counters[spec.key] || 0) + 1;
      } catch (e) {
        console.error("[pi-bridge] wire_animation hook error:", e);
      }
    });
  }

  // Auras persistentes (feats pasivos sin actividad) -> aplicar directo al token.
  const appliedAuras = [];
  for (const p of persistentAuras) {
    if (!p.tokenId || !p.file) throw new Error("Cada persistentAura requiere tokenId y file.");
    const key = p.counterKey || slug(p.file);
    const tok = canvas.tokens.get(p.tokenId);
    if (tok) {
      let seq = new Sequence().effect().file(p.file).atLocation(tok);
      if (p.scale && p.scale !== 1) seq = seq.scale(p.scale);
      if (p.tint) seq = seq.tint(p.tint);
      seq.persist(true, { name: "pi-bridge-aura-" + key }).play();
      STATE.counters[key] = (STATE.counters[key] || 0) + 1;
      appliedAuras.push({ tokenId: p.tokenId, key });
    }
  }

  return {
    ok: true,
    hookRegistered: STATE.wired,
    animations: Object.values(STATE.map),
    persistentAuras: appliedAuras,
    counters: STATE.counters,
  };
}

function resolveToken(loc, actor, defaultTargetTokenId) {
  if (loc === "self") {
    if (actor?.token?.object) return actor.token.object;
    const t = actor?.getActiveTokens?.()?.[0];
    if (t) return t;
    return canvas.tokens.placeables.find((x) => x.actor === actor) || null;
  }
  const sel = game.user.targets?.size ? game.user.targets.first() : null;
  if (sel) return sel;
  if (defaultTargetTokenId) return canvas.tokens.get(defaultTargetTokenId) || null;
  return null;
}
