/**
 * V14 migration shim for deprecated flat Scene properties.
 * Rewrites legacy keys to their V14 nested equivalents before update.
 * Source: Foundry issue #13436 — "Documents" section.
 *
 * @param {object} data - The scene update data (may contain deprecated keys)
 * @returns {object} Data with all deprecated keys migrated
 */
function migrateSceneDataForV14(data) {
  const result = { ...data };

  // Fog properties: flat → fog.* nested structure
  // V14 SceneData.fog schema: { mode, reset, colors }
  //   mode: 0=disabled, 1=explore-only, 2=overlay-only, 3=both
  // Combine legacy fogExploration + fogOverlay booleans into fog.mode.
  const hasExploration = "fogExploration" in result;
  const hasOverlay = "fogOverlay" in result;
  if (hasExploration || hasOverlay) {
    result.fog ??= {};
    const exploreBit = hasExploration && result.fogExploration ? 1 : 0;
    const overlayBit = hasOverlay && result.fogOverlay ? 2 : 0;
    const mode = exploreBit | overlayBit;
    if (mode !== 0) {
      result.fog.mode = mode;
    }
    if (hasExploration) delete result.fogExploration;
    if (hasOverlay) delete result.fogOverlay;
  }

  // fogReset → fog.reset (this field is real in V14)
  if ("fogReset" in result) {
    result.fog ??= {};
    result.fog.reset = result.fogReset;
    delete result.fogReset;
  }
  if ("fogExploredColor" in result) {
    result.fog ??= {};
    result.fog.colors ??= {};
    result.fog.colors.explored = result.fogExploredColor;
    delete result.fogExploredColor;
  }
  if ("fogUnexploredColor" in result) {
    result.fog ??= {};
    result.fog.colors ??= {};
    result.fog.colors.unexplored = result.fogUnexploredColor;
    delete result.fogUnexploredColor;
  }

  // Lighting properties: flat → environment.* nested structure
  if ("globalLight" in result) {
    result.environment ??= {};
    result.environment.globalLight ??= {};
    result.environment.globalLight.enabled = result.globalLight;
    delete result.globalLight;
  }
  if ("globalLightThreshold" in result) {
    result.environment ??= {};
    result.environment.globalLight ??= {};
    result.environment.globalLight.darkness ??= {};
    result.environment.globalLight.darkness.max = result.globalLightThreshold;
    delete result.globalLightThreshold;
  }
  if ("darkness" in result) {
    result.environment ??= {};
    result.environment.darknessLevel = result.darkness;
    delete result.darkness;
  }

  return result;
}

/**
 * Actualizar una escena.
 *
 * args: {
 *   sceneId?: string,  // default: escena activa
 *   data: object,      // datos de actualización (name, img, grid, etc.)
 * }
 *
 * Returns: { sceneId: string, updated: boolean }
 */
export async function updateScene({ sceneId, data }) {
  const scene = sceneId ? game.scenes.get(sceneId) : canvas.scene;
  if (!scene) {
    throw new Error("Escena no encontrada.");
  }

  // V14 migration shim: rewrite deprecated flat Scene properties to nested equivalents.
  // Source: Foundry issue #13436 — "Documents" section.
  const migratedData = migrateSceneDataForV14(data);

  const updated = await scene.update(migratedData);

  return {
    sceneId: scene.id,
    updated: !!updated,
  };
}
