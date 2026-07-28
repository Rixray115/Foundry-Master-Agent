/**
 * sync_modules — Escanea módulos activos y compara con conocimiento conocido.
 *
 * Args: {}
 *
 * Returns: {
 *   known: Array<{ id, title, version }>,
 *   unknown: Array<{ id, title, version }>,
 *   versionMismatches: Array<{ id, title, installed, curated }>,
 * }
 */

// Módulos con conocimiento curado en el repositorio (V14).
// Solo incluye módulos con archivos .md en knowledge/.
const CURATED = {
  "midi-qol": "14.0.11",
  "sequencer": "4.2.3",
  "JB2A_DnD5e": "0.9.1",
  "dae": "14.0.12",
  "ActiveAuras": "0.12.7",
  "times-up": "13.1.9",
  "plutonium": "2.16.2.v14",
  "tagger": "1.6.0",
  "autoanimations": "7.0.17",
  // Added via deep module analysis (2026-07-26)
  "cat": "0.0.6",
  "plutonium-addon-automation": "0.8.4",
  "dfreds-convenient-effects": "9.2.1",
  "dorman-lakelys-crit-fumble-tables": "1.4.0",
  "_chatcommands": "2.0.6",
  "audio-tagger": "1.5.4",
  "monks-tokenbar": "14.01",
  "swarm-reanimated": "14.0.2",
  "advanced-macros": "2.4.0",
  "item-piles": "3.3.4",
  "combat-tracker-dock": "5.0.0",
  "looter": "0.4.1",
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
