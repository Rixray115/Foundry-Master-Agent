/**
 * Crear Regiones (V14) embebidas en una escena.
 * V14 introdujo Region como documento embebido en Scene.
 * Una región requiere al menos un shape; el shape usa el modelo de datos de V14:
 *   - rectangle: { type: "rectangle", x, y, width, height }
 *   - circle:    { type: "circle", x, y, radius }
 *   - polygon:   { type: "polygon", points: [x1, y1, x2, y2, ...] }
 *
 * args: {
 *   regions: Array<{
 *     name: string,                              // nombre de la región
 *     shape: object,                             // shape V14 (ver arriba)
 *     sceneId?: string,                          // default: escena activa (canvas.scene)
 *     color?: string,                            // hex (default: color aleatorio de V14)
 *   }>,
 * }
 *
 * Returns: { regionIds: string[], regions: [{id, name}] }
 */
export async function createRegion({ regions }) {
  const built = [];

  for (const r of regions) {
    const scene = r.sceneId ? game.scenes.get(r.sceneId) : canvas.scene;
    if (!scene) {
      throw new Error(`Escena no encontrada: ${r.sceneId ?? "(activa)"}`);
    }

    // V14 Region embedded document. Elevation is intentionally omitted so V14 applies its
    // default ({ bottom: null, top: null } = unbounded). Passing +/-Infinity is rejected by
    // the Region data model (e.g. MidiQOL's MidiRegionDocument requires finite numbers).
    const data = {
      name: r.name,
      // ShapesField expects an array of shapes (TypedSchemaField per type).
      shapes: [r.shape],
    };
    if (r.color) data.color = r.color;

    built.push({ scene, data });
  }

  const regionIds = [];
  const result = [];

  for (const { scene, data } of built) {
    const created = await scene.createEmbeddedDocuments("Region", [data]);
    if (!created || created.length === 0) {
      throw new Error(`Region "${data.name}" no pudo crearse (forma/elevación inválida?).`);
    }
    const [region] = created;
    regionIds.push(region.id);
    result.push({ id: region.id, name: region.name });
  }

  return { regionIds, regions: result };
}
