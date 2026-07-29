# libWrapper (lib-wrapper) — v1.13.5.1

## API Global
- `libWrapper` (global): Objeto principal para gestionar wrappers de métodos Foundry.

## Funciones Principales
- `libWrapper.register(module, target, fn, type)`: Registra un wrapper para sobrescribir o interceptar un método/parche de Foundry.
  - `module`: ID del módulo (string).
  - `target`: Ruta completa del método (ej. `"CONFIG.Actor.documentClass.prototype.prepareData"`).
  - `fn`: Función wrapper (recibe los argumentos originales y la función envuelta).
  - `type`: Tipo de wrapper (`"WRAPPER"`, `"MIXED"`, `"OVERRIDE"`, `"PATCH_AFTER"`, `"PATCH_BEFORE"`).
- `libWrapper.unregister(module, target)`: Elimina un wrapper registrado.
- `libWrapper.clearWrapper(module)`: Limpia todos los wrappers de un módulo.

## Hooks
- `init`: Se dispara al inicializar libWrapper; útil para registrar wrappers temprano.

## Uso
Esta biblioteca permite a otros módulos envolver métodos de FoundryVTT sin conflictos, asegurando que múltiples módulos puedan modificar el mismo método de forma ordenada. Los tipos de wrapper controlan cómo se combinan: `WRAPPER` encadena llamadas, `OVERRIDE` reemplaza completamente, `PATCH_AFTER`/`PATCH_BEFORE` ejecutan antes/después del original. No se usa directamente por usuarios finales, sino por desarrolladores de módulos.

## Ejemplos
```javascript
// Registrar un wrapper para modificar prepareData de un actor
Hooks.on("init", () => {
  libWrapper.register("my-module", "CONFIG.Actor.documentClass.prototype.prepareData", function (wrapped, ...args) {
    // Lógica personalizada antes
    const data = wrapped(...args);
    // Modificar data después
    data.customField = "valor";
    return data;
  }, "WRAPPER");
});
```

## Dependencias
- Ninguna (es una dependencia para otros módulos).
