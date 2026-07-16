/**
 * sync_modules — Escanea módulos activos y compara con conocimiento conocido.
 *
 * args: {}
 *
 * Returns: {
 *   known: Array<{ id, title, version }>,
 *   unknown: Array<{ id, title, version }>,
 *   versionMismatches: Array<{ id, title, installed, curated }>,
 * }
 */

// Módulos con conocimiento curado en el repositorio.
// Las versiones reflejan lo instalado en el world (V14). Actualizado 2026-07-16.
const CURATED = {
  "midi-qol": "14.0.11",
  "sequencer": "4.2.3",
  "JB2A_DnD5e": "0.9.1",
  "dae": "14.0.12",
  "ActiveAuras": "0.12.7",
  "times-up": "13.1.9",
  "plutonium": "2.16.2.v14",
  "tagger": "1.6.0",
  "autoanimations": "7.0.16",
  "chris-premades": "1.5.27",
  // Aprendidos vía analyze_module + index_knowledge (2026-07-16)
  "dfreds-convenient-effects": "9.0.2",
  "dice-so-nice": "6.2.8",
  "monks-active-tiles": "14.01",
  "tidy5e-sheet": "13.5.0",
  "tokenizer-2": "1.2.3",
  "swarm-reanimated": "14.0.2",
  "advanced-macros": "2.4.0",
  "psfx": "0.15.0",
  // Ecosistema / hubs aprendidos (2026-07-16)
  "lib-dfreds-ui-extender": "2.3.0",
  "lib-dfreds-migrations": "1.0.3",
  "plutonium-addon-automation": "0.8.4",
  "aeris-core": "v13.0.23",
  "bg3-hud-core": "0.4.3",
  // Aeris cinematic suite + BG3 HUD adapter + taggers (2026-07-16)
  "aeris-animations": "v13.0.9",
  "aeris-cinematic-bars": "v13.0.4",
  "aeris-cinematic-view": "v13.0.4",
  "aeris-smooth-camera": "0.0.13",
  "bg3-hud-dnd5e": "0.4.1",
  "audio-tagger": "1.5.4",
  "document-tagger": "1.1.0",
  // Monk's suite (2026-07-16)
  "monks-bloodsplats": "14.01",
  "monks-combat-details": "14.02",
  "monks-combat-marker": "12.01",
  "monks-common-display": "14.01",
  "monks-hotbar-expansion": "14.01",
  "monks-little-details": "14.01",
  "monks-player-settings": "14.01",
  "monks-scene-navigation": "14.02",
  "monks-sound-enhancements": "14.01",
  "monks-tokenbar": "14.01",
  "monks-wall-enhancement": "14.01",
  // Misceláneos (2026-07-16)
  "monks-chat-timer": "14.01",
  "cat": "0.0.5",
  "dice-calculator": "3.7.0",
  "augur-nexus": "1.1.9",
  "dorman-lakelys-crit-fumble-tables": "1.4.0",
  "_chatcommands": "2.0.6",
};

export async function syncModules() {
  const activeModules = Array.from(game.modules.values()).filter((m) => m.active);

  const known = [];
  const unknown = [];
  const versionMismatches = [];

  for (const m of activeModules) {
    const info = { id: m.id, title: m.title, version: m.version };

    if (CURATED[m.id]) {
      known.push(info);
      if (m.version !== CURATED[m.id]) {
        versionMismatches.push({
          id: m.id,
          title: m.title,
          installed: m.version,
          curated: CURATED[m.id],
        });
      }
    } else {
      // Skip system modules and our own
      if (m.id === "pi-bridge") continue;
      unknown.push(info);
    }
  }

  return { known, unknown, versionMismatches };
}
