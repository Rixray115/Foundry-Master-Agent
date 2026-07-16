/**
 * Crear macros.
 * Crea uno o más macros (script o chat) en el mundo.
 *
 * args: {
 *   macros: Array<{
 *     name: string,             // nombre de la macro
 *     type: "script" | "chat",  // tipo de macro (string legible; se mapea a CONST.MACRO_TYPES numérico)
 *     command: string,          // cuerpo (código JS para script, texto/comando para chat)
 *     img?: string,             // icono (default: dice-target)
 *     scope?: "global" | "actor", // default: "global"
 *   }>,
 * }
 *
 * Returns: { macroIds: string[], macros: [{id, name, type}] }
 *
 * NOTA V14: Macro.type es NUMÉRICO (CONST.MACRO_TYPES: SCRIPT=0, CHAT=1), no el string
 * "script"/"chat". El schema de entrada sigue aceptando strings por legibilidad; este
 * handler los convierte al valor numérico que espera Foundry. Sin esto, Macro.createDocuments
 * falla la validación del schema de Macro (type debe ser number).
 */

// Mapa de tipos legibles → valor numérico de CONST.MACRO_TYPES
const MACRO_TYPE = {
  script: CONST?.MACRO_TYPES?.SCRIPT ?? 0,
  chat: CONST?.MACRO_TYPES?.CHAT ?? 1,
};

function resolveMacroType(t) {
  if (typeof t === "number") return t;       // ya numérico (passthrough)
  if (t in MACRO_TYPE) return MACRO_TYPE[t];  // "script"/"chat" → 0/1
  return CONST?.MACRO_TYPES?.SCRIPT ?? 0;     // fallback
}

export async function createMacro({ macros }) {
  const createData = macros.map((m) => {
    const data = {
      name: m.name,
      type: resolveMacroType(m.type),
      command: m.command ?? "",
    };
    if (m.img) data.img = m.img;
    if (m.scope) data.scope = m.scope;
    // author se autocompleta con el usuario actual; color/img tienen initial.
    return data;
  });

  const created = await Macro.createDocuments(createData);

  return {
    macroIds: created.map((m) => m.id),
    macros: created.map((m) => ({ id: m.id, name: m.name, type: m.type })),
  };
}
