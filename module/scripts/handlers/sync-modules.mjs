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
