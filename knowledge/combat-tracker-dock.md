# Carousel Combat Tracker v5.0.0 — Dock de Combate

## API Global

```js
No API pública detectada. Módulo exclusivamente UI.
```

## Clases Principales

```js
CombatDock              // Controlador principal del dock
CombatantPortrait       // Manejo de retratos individuales
AddEvent                // Eventos de adición de combatientes
AttributesConfig        // Configuración de atributos mostrados
HandlebarsApplication   // Aplicación base Handlebars
```

## Hooks Disponibles

```js
combatDock:playIntroAnimation          // Al iniciar animación de entrada
combatDock:playIntroAnimation:finished // Cuando termina la animación
createCombat                           // Creación de combate
updateCombat                           // Actualización de combate
renderCombatTracker                    // Render del tracker original
renderCombatTrackerConfig              // Config del tracker
renderSettingsConfig                   // Configuración general
canvasReady                            // Canvas listo
init                                   // Inicialización del módulo
ready                                  // Módulo cargado completamente
```

## Uso

Reemplaza el combat tracker tradicional por un carrusel horizontal en la parte inferior de la pantalla. Muestra retratos de combatientes en un dock scrolleable. Ideal para pantallas con poco espacio vertical o mesas que prefieren una vista más visual del orden de iniciativa.

## Configuración

- **Settings**: Accesible desde Configuración del Mundo → Carousel Combat Tracker
- **Atributos**: Configura qué stats mostrar en cada retrato (HP, AC, etc.)
- **Animaciones**: Activar/desactivar animación de entrada del dock

## Ejemplos

```js
// Escuchar cuando termina la animación de entrada
Hooks.on("combatDock:playIntroAnimation:finished", () => {
  console.log("Dock de combate listo");
});

// Forzar actualización del dock al modificar combate
Hooks.on("updateCombat", (combat, update) => {
  // El dock se actualiza automáticamente
});
```
