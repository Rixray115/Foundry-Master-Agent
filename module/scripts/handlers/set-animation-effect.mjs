/**
 * set_animation_effect — Crea un Active Effect que controla una o más animaciones.
 *
 * El effect tiene flags.pi-bridge.animations con un array de configs.
 * Cuando el effect está activo → todas las animaciones se reproducen.
 * Cuando se deshabilita/elimina → todas se detienen.
 *
 * args: {
 *   actorId: string,
 *   name: string,
 *   icon?: string,
 *   disabled?: boolean,
 *   animations: [           // array de animaciones
 *     {
 *       file: string,
 *       tint?: string,
 *       scale?: number,
 *       persist?: boolean,
 *       attachTo?: boolean,
 *       belowTokens?: boolean,
 *     },
 *     ...
 *   ]
 * }
 *
 * También acepta formato single (backward compat):
 *   file, tint, scale, persist, attachTo, belowTokens
 */
export async function setAnimationEffect({
  actorId,
  name,
  icon,
  disabled = false,
  animations,
  // Single-animation shorthand
  file,
  tint,
  scale = 1,
  persist = true,
  attachTo = true,
  belowTokens = true,
}) {
  const actor = game.actors.get(actorId);
  if (!actor) throw new Error(`Actor "${actorId}" no encontrado.`);

  if (!game.modules.get("sequencer")?.active) {
    throw new Error("Sequencer no está activo.");
  }

  // Normalizar a array de animaciones
  let anims;
  if (Array.isArray(animations) && animations.length > 0) {
    anims = animations.map((a, i) => ({
      file: a.file,
      tint: a.tint,
      scale: a.scale ?? 1,
      persist: a.persist ?? true,
      attachTo: a.attachTo ?? true,
      belowTokens: a.belowTokens ?? true,
      name: `anim-${actorId}-${name}-${i}`,
    }));
  } else if (file) {
    // Single-animation shorthand
    anims = [{
      file,
      tint,
      scale,
      persist,
      attachTo,
      belowTokens,
      name: `anim-${actorId}-${name}-0`,
    }];
  } else {
    throw new Error("Debe proporcionar 'animations' (array) o 'file' (single).");
  }

  // Crear el Active Effect
  const effectData = {
    name,
    icon: icon || "icons/magic/air/air-swirl-purple.webp",
    disabled,
    changes: [],
    flags: {
      "pi-bridge": {
        animations: anims,
      },
    },
  };

  // Si ya existe un effect con este nombre, actualizarlo
  const existing = actor.effects.find(e => e.name === name);
  let effect;
  if (existing) {
    await existing.update(effectData);
    effect = existing;
  } else {
    effect = await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    effect = effect[0];
  }

  return {
    ok: true,
    actorId,
    effectId: effect.id,
    effectName: effect.name,
    disabled: effect.disabled,
    animations: anims,
  };
}
