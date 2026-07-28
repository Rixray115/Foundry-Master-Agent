# Looter (looter) — v0.4.1

## API Global

`game.looter` — acceso principal al módulo.

## Funciones Principales

- `LooterApplicationV2` — aplicación principal de looteo automático.
- `LooterEncounterApp` — gestión de encuentros y tesoros generados.
- `LooterMonsterTableApp` — configuración de tablas por monstruo.
- `LooterTreasureProfilesApp` — perfiles de tesoro personalizados.

## Hooks

- `deleteCombat` — genera loot al eliminar un combate completado.
- `preDeleteCombat` — validación antes de generar loot.
- `init` — registro de configuraciones y tablas por defecto.
- `ready` — inicialización de perfiles de tesoro.
- `renderActorDirectory` — inyecta botón de looteo rápido en el directorio.

## Uso

Genera tesoro automáticamente al finalizar combates en D&D 5e. Usa tablas rollable para determinar objetos, monedas y objetos mágicos según los monstruos derrotados. Compatible con encuentros del sistema y módulos de encuentros.

## Ejemplos

```javascript
// Generar loot manualmente para un combate
const combat = game.combats.active;
game.looter.generateLoot(combat);

// Configurar perfil de tesoro personalizado
const profile = new LooterTreasureProfilesApp();
profile.setProfile("high_magic", {
  coinMultiplier: 2,
  magicChance: 0.5
});
```
