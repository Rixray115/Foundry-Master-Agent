# Monk's PF2E Encounter Aftermath (monks-pf2e-encounter-aftermath) - v14.01

## API Global
- `game.modules.get('monks-pf2e-encounter-aftermath')` - Acceso al módulo.

## Funciones Principales
- Muestra estadísticas detalladas post-encuentro (daño, curaciones, turnos) para PF2E.
- Panel de resultados al finalizar combate.

## Hooks
- `init`: Configuración inicial.
- `ready`: Verifica sistema PF2E.
- `createCombat`: Prepara seguimiento.
- `deleteCombat`: Muestra estadísticas finales.

## Uso
- Automático al finalizar combates en PF2E. No requiere configuración manual.

## Ejemplos
```javascript
// Verificar si el módulo está activo
if (game.modules.get('monks-pf2e-encounter-aftermath')?.active) {
  console.log('Módulo activo');
}
```

## Dependencias
- Sistema PF2E (pf2e). No funcional en dnd5e.