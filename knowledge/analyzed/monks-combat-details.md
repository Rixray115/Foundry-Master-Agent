# Monk's Combat Details (monks-combat-details) — v14.02

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 14–∞ (verificado: 14)

## API Surface
### Globals
- `globalThis.resizable` / `game.resizable`

## Hooks (20 encontrados)
- `closeCombatTracker`
- `combatTurn`
- `createActiveEffect`
- `createCombat`
- `createCombatant`
- `deleteCombat`
- `getCombatTrackerContextOptions`
- `init`
- `preUpdateActor`
- `preUpdateItem`
- `ready`
- `renderCombatTracker`
- `renderCombatTrackerConfig`
- `renderSettingsConfig`
- `setup`
- `setupTileActions`
- `updateActiveEffect`
- `updateCombat`
- `updateCombatant`
- `updateToken`

## Classes (1 encontradas)
- `MonksCombatDetails`

## README (excerpt)
```markdown
# Monk's Combat Details
A bunch of quality of life things to make running combat a little easier.  Including turn notification, combat automations, combat tracker upgrades, and token status bars specifically for combat.

## Installation
Simply use the install module screen within the FoundryVTT setup

## Usage & Current Features
### Turn notifications
During combat the player will receive an on screen alert notification, and sound effect when their turn is up next, and another one when it's their turn to move.  The sound being played can be customised, and individual users can opt out of receiving the sound effect.  By default this is turned off for the GM but it can be turned on.

You can also have it display in a large animated format in case you have players that need something a little less subtle.

![monks-combat-details](/screenshots/your-turn.png)

### Combat Encounter Automation
When a combat is created, Monk's Combat Details can automatically switch you to the combat tab so you can configure details of the combat.  And when the combat is started it can automatically pop out the combat tracker, and switch back to the chat tab.  When the combat is complete, it can also automatically close the popout window.

You can also have the current creature on the combat tracker always displayed.  So if you have a long list of combatants, Monk's Combat Details will scroll the view so that they're in view.

### Combat initiative ordering
You have the option for player characters to be sorted to the top of the list for them when they need to roll initiative.  That way they're not chasing their token around when trying to roll initiative while other combatants have finished rolling and have altered the initiative order.

### Strict combat requirements
Monk's Combat Details will warn you if you attempt to start a combat when not all tokens have rolled initiave.  You can always choose to ignore this message but it will prevent last minute corrctions of initiative.

You can also set it so that tokens can't be removed from combat using the token HUD.  This way if you accidentally click the wrong button on the HUD you don't have to remember where they were in combat.  You can still remove tokens from the combat via the Combat Tracker.

And if a player attempts to change their prepared spells in the middle of combat, you can either prevent the action, or have the GM sent a private message letting you know what player and what spell was changed.

### Creatures on the combat tracker
You can also hide creatures from players while you are creating the encounter.  That way they won't know what's in store for them until battle starts.  You can also set this up so that enemies aren't revealed in the combat tracker until they've had their first turn.  And when an enemy is defeated, you can have it hidden from the player to keep the field of combat clean.

### Automatic creature status
Monk's Combat Details can also automatically set t
```
