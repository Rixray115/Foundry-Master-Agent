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

  // Restaurar automatización persistida (animaciones + hooks de Kafka) tras reload.
  restoreAutomation();

  console.log("[pi-bridge] Módulo listo.", { relayUrl, allowUnsafe });
});
