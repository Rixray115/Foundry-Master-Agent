/**
 * Importar creature desde 5etools via Plutonium.
 * Usa la API game.plutonium.importer.creature.pImportEntry para importar
 * monsters completos con todas sus acciones, traits, stats, etc.
 *
 * args: {
 *   creatures: Array<{
 *     name: string,       // nombre exacto del monster (ej. "Orc")
 *     source?: string,    // source code (ej. "MM", "XMM"). Default: "MM"
 *   }>,
 * }
 *
 * Returns: { results: Array<{ name, source, actorId?, error? }> }
 */
export async function plutoniumImport({ creatures }) {
  // Verificar que Plutonium está activo y obtener su API
  const plutoniumModule = game.modules.get("plutonium");
  if (!plutoniumModule?.active) {
    throw new Error(`Plutonium no está activo. Estado: ${plutoniumModule ? "instalado" : "no instalado"}`);
  }

  // Intentar múltiples rutas para encontrar la API
  const api = game.plutonium ?? globalThis.plutonium ?? plutoniumModule.api;
  if (!api) {
    throw new Error(`Plutonium activo pero API no encontrada. game.plutonium: ${!!game.plutonium}, globalThis.plutonium: ${!!globalThis.plutonium}, module.api: ${!!plutoniumModule.api}`);
  }

  // Buscar el método de import de creatures
  const creatureImport = api.importer?.creature?.pImportEntry;
  if (!creatureImport) {
    const importerKeys = api.importer ? Object.keys(api.importer) : "no importer";
    const creatureKeys = api.importer?.creature ? Object.keys(api.importer.creature) : "no creature";
    throw new Error(`API encontrada pero pImportEntry no disponible. importer keys: ${importerKeys}, creature keys: ${creatureKeys}`);
  }

  const results = [];

  for (const { name, source = "MM" } of creatures) {
    try {
      // Cargar datos del bestiario desde los archivos bundled de Plutonium
      const fileName = `bestiary-${source.toLowerCase()}.json`;
      // En Foundry V13, los archivos de módulos se sirven en /modules/<id>/...
      const url = `${window.location.origin}/modules/plutonium/data/bestiary/${fileName}`;

      console.log(`[pi-bridge] Cargando bestiary: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${fileName}: ${response.status}`);
      }
      const data = await response.json();

      // Buscar el creature por nombre
      const monsters = data.monster || data.creature || [];
      const entry = monsters.find(
        (m) => m.name === name && (m.source === source || !source)
      );

      if (!entry) {
        throw new Error(`Creature "${name}" (source: ${source}) no encontrado en ${fileName}`);
      }

      console.log(`[pi-bridge] Importando "${name}" via Plutonium...`);

      // Llamar a la API de Plutonium para importar
      const importResult = await creatureImport(entry, {
        isTemp: false,
      });

      // V14 Plutonium returns ImportSummary, not raw actors.
      // ImportSummary.getPrimaryDocument() → the created Actor document.
      let actor = null;
      if (typeof importResult?.getPrimaryDocument === "function") {
        actor = importResult.getPrimaryDocument();
      } else if (importResult?.id) {
        // Fallback for V13-style raw actor returns
        actor = importResult;
      } else if (importResult?.actor) {
        actor = importResult.actor;
      }

      // Last resort: find by name in game.actors
      if (!actor) {
        const existing = game.actors.filter(a => a.name === name);
        if (existing.length > 0) actor = existing[existing.length - 1];
      }

      const actorId = actor?.id ?? null;
      const actorItems = actor?.items?.map(i => i.name) ?? [];

      results.push({
        name,
        source,
        actorId,
        actorName: actor?.name ?? null,
        items: actorItems,
        success: true,
      });

      console.log(`[pi-bridge] ✓ "${name}" importado. actorId: ${actorId}, items: ${actorItems.join(", ")}`);
    } catch (err) {
      console.error(`[pi-bridge] Error importando "${name}":`, err);
      results.push({
        name,
        source,
        success: false,
        error: err.message,
      });
    }
  }

  return { results };
}
