# Automated Animations (autoanimations) — v7.0.17

> Generado automáticamente por `analyze-modules.mjs`

⚠️ **Versión difiere del curado**: instalado 7.0.17 vs curado 6.8.5

**Compatibilidad**: Foundry 14–14 (verificado: 14)

## API Surface
### Globals
- `globalThis.TRL_SVELTE_APP_DATA` / `game.TRL_SVELTE_APP_DATA`
- `globalThis.__svelte` / `game.__svelte`
- `globalThis.MIN_WINDOW_HEIGHT` / `game.MIN_WINDOW_HEIGHT`
- `globalThis.MIN_WINDOW_WIDTH` / `game.MIN_WINDOW_WIDTH`
- `globalThis.AutoAnimations` / `game.AutoAnimations`
- `globalThis.AutomatedAnimations` / `game.AutomatedAnimations`

## Public Methods
- `api_layAnimation()`
- `api_rompt()`

## Hooks (72 encontrados)
- `AA.Open.AutorecSetting`
- `AutomatedAnimations-WorkflowStart`
- `AutomatedAnimations.metaData`
- `AutomaticAnimations.Clear.Data`
- `AutomaticAnimations.Open.Menu.New`
- `BRSW-CreateItemCardNoRoll`
- `BRSW-RollDamage`
- `BRSW-RollItem`
- `DL.Action`
- `PopOut:close`
- `PopOut:loading`
- `PopOut:popin`
- `a5e.measuredTemplatePlaced`
- `aa.animationEnd`
- `aa.animationStart`
- `aa.getRequiredData`
- `aa.initialize`
- `aa.preAnimationStart`
- `aa.preDataSanitize`
- `aa.ready`
- `aa.workflow`
- `attackRolled`
- `chatOutput`
- `close${cls.name}`
- `createActiveEffect`
- `createChatMessage`
- `createItem`
- `createRegion`
- `damageRolled`
- `deleteActiveEffect`
- `deleteItem`
- `dnd4e.rollAttack`
- `dnd4e.rollDamage`
- `dnd4e.rollHealing`
- `dnd4e.usePower`
- `dnd5e.postUseActivity`
- `dnd5e.preUseActivity`
- `dnd5e.rollAttackV2`
- `dnd5e.rollDamageV2`
- `ds4.rollItem`
- `fadeAttackRoll`
- `fadeCastSpell`
- `ffgDiceMessage`
- `getHeaderControlsApplicationV2`
- `getItemSheetHeaderButtons`
- `hotbarDrop`
- `init`
- `midi-qol.AttackRollComplete`
- `midi-qol.DamageRollComplete`
- `midi-qol.RollComplete`
- ... y 22 más

## Classes (249 encontradas)
- `A11yHelper`
- `AAAutorecFunctions`
- `AAAutorecManager`
- `AADiagnostics`
- `AAGameSettings`
- `AAHandler`
- `AEAppShell`
- `AEMenuApp`
- `APIConfig`
- `APIUtil`
- `AdapterDerived`
- `AdapterFilters`
- `AdapterIndexer`
- `AdapterSort`
- `AdapterValidators`
- `AdvancedAutorec`
- `AlwaysOnTop`
- `Animation`
- `AnimationAPIImpl`
- `AnimationControl`
- `AnimationGroupAPIImpl`
- `AnimationGroupControl`
- `AnimationManager`
- `AnimationScheduler`
- `AnimationState`
- `AnimationStore`
- `AnimationStore2`
- `AnimationStore3`
- `AppShellContextInternal`
- `ApplicationShell`
- ... y 219 más

## README (excerpt)
```markdown
# Automated Animations
> [!WARNING]  
> Note that since I've taken over the module, there will be no updates or fixes to the V12 version, as v13 is close i will start developement with that foundry version. For any issues\help with the v12 version, see https://discord.com/channels/772596237605011466/1067667886191149176 in the JB2A (https://discord.gg/mehvR2WD) discord channel

This module will automatically run most JB2A Animations such as Melee/Ranged Attacks, Spell Attacks, and Instant Spells

## Before opening an issue read [THIS](https://github.com/theripper93/Levels/blob/v9/ISSUES.md)

![Latest Release Download Count](https://img.shields.io/github/downloads/theripper93/Splatter/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fsplatter&colorB=03ff1c&style=for-the-badge)](https://forge-vtt.com/bazaar#package=autoanimations) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftheripper93%2FSplatter%2Fmain%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge) [![alt-text](https://img.shields.io/badge/-Patreon-%23ff424d?style=for-the-badge)](https://www.patreon.com/theripper93) [![alt-text](https://img.shields.io/badge/-Discord-%235662f6?style=for-the-badge)](https://discord.gg/F53gBjR97G)

## You can find the documentation on the [WIKI](https://api.theripper93.com/modulewiki/autoanimations/free)

**No animations are provided in this module. It is designed to work in conjunction with the JB2A Animated Assets module. This module has been reviewed, approved and recommended by JB2A**  
I am not affiliated with JB2A, and am working on this only as a side project to make these great animation more easily accesible. 
  
## **Tutorial Video Links**
* [Module Overview](https://www.youtube.com/watch?v=FkdjiCLnfyw)
* [Overview of A-A Menus](https://www.youtube.com/watch?v=CLRKn_hEKoQ)
* [Animation Menus](https://www.youtube.com/watch?v=gIPFrtbJ1qk)
* [Preset Menu](https://www.youtube.com/watch?v=QmtGLeoHCKo)
* [Macros](https://www.youtube.com/watch?v=WVHmt5CrnDc)
* [Advanced Setup](https://www.youtube.com/watch?v=uIiBm3GAQds)
```
