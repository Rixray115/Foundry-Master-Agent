/**
 * PI Bridge — Entry point (módulo FoundryVTT)
 * Se ejecuta en el browser del GM.
 *
 * Flujo:
 *  1. init: registra settings
 *  2. ready: si el usuario es GM, conecta al relay via WebSocket
 *     y empieza a recibir/ejecutar comandos
 */

import { registerSettings } from "./settings.mjs";
import { BridgeClient } from "./bridge-client.mjs";
import { CommandRouter } from "./command-router.mjs";
import { wireAnimation } from "./handlers/wire-animation.mjs";

const MODULE_ID = "pi-bridge";

// Restaura la automatización persistida en los flags de los actores tras un reload.
function restoreAutomation() {
  try {
    for (const actor of game.actors) {
      const anims = actor.getFlag(MODULE_ID, "animations");
      if (Array.isArray(anims) && anims.length) {
        try { wireAnimation({ animations: anims }); } catch (e) { console.error("[pi-bridge] restore anim", e); }
      }
      const macroName = actor.getFlag(MODULE_ID, "kafkaAutomation");
      if (typeof macroName === "string") {
        const m = game.macros.getName(macroName);
        if (m) { try { m.execute(); } catch (e) { console.error("[pi-bridge] restore macro", e); } }
      }
    }
    console.log("[pi-bridge] automatización restaurada desde flags.");
  } catch (e) {
    console.error("[pi-bridge] restoreAutomation error:", e);
  }
}

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", async () => {
  // Solo el GM ejecuta comandos
  if (!game.user.isGM) {
    console.log("[pi-bridge] Usuario no es GM. Módulo inactivo.");
    return;
  }

  let relayUrl = game.settings.get(MODULE_ID, "relayUrl");
  const allowUnsafe = game.settings.get(MODULE_ID, "allowUnsafe");

  // Auto-detectar URL del relay si está vacía.
  // Usa el mismo host y puerto que Foundry (Caddy proxya /pi-bridge/* al relay).
  if (!relayUrl) {
    const host = window.location.hostname;
    const port = window.location.port;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    relayUrl = `${proto}//${host}${port ? ':' + port : ''}/pi-bridge/gm`;
    console.log(`[pi-bridge] relayUrl auto-detectada: ${relayUrl}`);
  }

  // Validar que el token está configurado
  const token = game.settings.get(MODULE_ID, "authToken");
  if (!token) {
    ui.notifications.warn(
      "PI Bridge: Auth Token no configurado. Ve a Settings → PI Bridge y configúralo.",
      { permanent: true }
    );
    console.warn("[pi-bridge] Auth token no configurado. El módulo no funcionará hasta configurarlo.");
  }

  const cfg = { relayUrl, authToken: token, allowUnsafe };
  const router = new CommandRouter({ allowUnsafe });
  const client = new BridgeClient(cfg, router);

  // Exponer para debugging desde la consola del browser
  globalThis.piBridge = { client, router, cfg };

  await client.connect();

  console.log("[pi-bridge] Módulo listo.", { relayUrl, allowUnsafe });

  // ─── Hooks de animación via Active Effects ─────────────
  // Cuando un effect con flags.pi-bridge.animations se crea/habilita,
  // reproducir la animación. Cuando se deshabilita/elimina, detenerla.

  function playEffectAnimation(effect, token) {
    const anims = effect.flags?.["pi-bridge"]?.animations;
    if (!anims || !Array.isArray(anims)) return;

    for (const anim of anims) {
      let seq = new Sequence().effect().file(anim.file);
      if (anim.attachTo) {
        seq = seq.attachTo(token);
      } else {
        seq = seq.atLocation(token);
      }
      if (anim.scale && anim.scale !== 1) seq = seq.scale(anim.scale);
      if (anim.tint) seq = seq.tint(anim.tint);
      if (anim.belowTokens) seq = seq.belowTokens();
      if (anim.name) seq = seq.name(anim.name);
      if (anim.persist) seq = seq.persist(true);
      seq.play();
    }
  }

  function stopEffectAnimation(effect) {
    const anims = effect.flags?.["pi-bridge"]?.animations;
    if (!anims || !Array.isArray(anims)) return;

    for (const anim of anims) {
      if (!anim.name) continue;
      try {
        Sequencer.EffectManager.endEffects({ name: anim.name });
      } catch (e1) {
        try {
          Sequencer.EffectManager.endEffect(anim.name);
        } catch (e2) {
          console.warn("[pi-bridge] Error deteniendo animación:", anim.name, e2);
        }
      }
    }
  }

  function getActorTokens(actor) {
    return canvas.tokens.placeables.filter(t => t.actor?.id === actor.id);
  }

  function hasPiBridgeAnimation(effect) {
    return !!effect.flags?.["pi-bridge"]?.animations;
  }

  // Hook: Active Effect creado
  Hooks.on("createActiveEffect", (effect, _options, _userId) => {
    if (!hasPiBridgeAnimation(effect)) return;
    if (effect.disabled) return;
    const tokens = getActorTokens(effect.parent);
    for (const token of tokens) {
      playEffectAnimation(effect, token);
    }
  });

  // Hook: Active Effect actualizado (toggle disabled)
  Hooks.on("updateActiveEffect", (effect, changes, _options, _userId) => {
    if (!hasPiBridgeAnimation(effect)) return;

    const disabledChanged = changes.disabled !== undefined;
    if (!disabledChanged) return;

    if (effect.disabled) {
      stopEffectAnimation(effect);
    } else {
      const tokens = getActorTokens(effect.parent);
      for (const token of tokens) {
        playEffectAnimation(effect, token);
      }
    }
  });

  // Hook: Active Effect eliminado
  Hooks.on("deleteActiveEffect", (effect, _options, _userId) => {
    if (!hasPiBridgeAnimation(effect)) return;
    stopEffectAnimation(effect);
  });

  // Hook: Token creado → reproducir animaciones de effects activos del actor
  Hooks.on("createToken", (tokenDoc, _options, _userId) => {
    if (!tokenDoc.actor) return;
    const activeEffects = tokenDoc.actor.effects.filter(
      e => !e.disabled && hasPiBridgeAnimation(e)
    );
    // El token del canvas puede no estar listo inmediatamente
    setTimeout(() => {
      const token = canvas.tokens.get(tokenDoc.id);
      if (!token) return;
      for (const effect of activeEffects) {
        playEffectAnimation(effect, token);
      }
    }, 500);
  });

  console.log("[pi-bridge] Hooks de animación registrados.");

  // Restaurar automatización persistida (animaciones + hooks de Kafka) tras reload.
  // Debe ejecutarse DESPUÉS de registrar los hooks para que los efectos restaurados
  // disparen correctamente los hooks de ciclo de vida.
  restoreAutomation();
});
