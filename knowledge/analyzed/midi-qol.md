# Midi QOL (midi-qol) — v14.0.11

> Generado automáticamente por `analyze-modules.mjs`

⚠️ **Versión difiere del curado**: instalado 14.0.11 vs curado 13.0.61

**Compatibilidad**: Foundry 14–14.999 (verificado: 14.357)

## API Surface
### Globals
- `globalThis.MidiDAEEval` / `game.MidiDAEEval`
- `globalThis.MidiKeyManager` / `game.MidiKeyManager`
### Module API
- `game.modules.get("midi-qol").api`

## Public Methods
- `api_layRandomSound()`
- `api_laySound()`

## Hooks (105 encontrados)
- `applyActiveEffect`
- `babele.ready`
- `combatRound`
- `combatTurn`
- `controlToken`
- `createChatMessage`
- `dae.addAutoFields`
- `dae.addFieldMappings`
- `dae.addSpecialDurations`
- `dae.modifyBaseValues`
- `dae.modifySpecials`
- `dae.ready`
- `dae.setFieldData`
- `dae.setupComplete`
- `ddb-game-log.fulfilledRoll`
- `ddb-game-log.pendingRoll`
- `deleteActiveEffect`
- `deleteActor`
- `deleteAmbientLight`
- `deleteChatMessage`
- `deleteItem`
- `deleteRegion`
- `deleteToken`
- `dfreds-convenient-effects.ready`
- `dnd5e.TransformToken`
- `dnd5e.activityConsumption`
- `dnd5e.applyDamage`
- `dnd5e.calculateDamage`
- `dnd5e.post${type}RollConfiguration`
- `dnd5e.postAttackRollConfiguration`
- `dnd5e.postRollConfiguration`
- `dnd5e.postSkillRollConfiguration`
- `dnd5e.postSummon`
- `dnd5e.postToolRollConfiguration`
- `dnd5e.preActivityConsumption`
- `dnd5e.preApplyDamage`
- `dnd5e.preCalculateDamage`
- `dnd5e.preConfigureInitiative`
- `dnd5e.preCreateActivityTemplate`
- `dnd5e.preRoll${type}`
- `dnd5e.preRollAttack`
- `dnd5e.preRollConcentration`
- `dnd5e.preRollDamage`
- `dnd5e.preRollDeathSave`
- `dnd5e.preRollSkill`
- `dnd5e.preRollTool`
- `dnd5e.preUseActivity`
- `dnd5e.restCompleted`
- `dnd5e.rollAttack`
- `dnd5e.rollConcentration`
- ... y 55 más

## Classes (57 encontradas)
- `ChatMessageMidi`
- `MidiActiveEffect`
- `MidiActivityMixin2`
- `MidiActivitySheet`
- `MidiActivityUsageDialog`
- `MidiActor`
- `MidiAmbientLightDocument`
- `MidiAttackActivity3`
- `MidiAttackActivitySheet`
- `MidiCastActivity`
- `MidiCastSheet`
- `MidiCheckActivity2`
- `MidiCheckSheet`
- `MidiDamageActivity2`
- `MidiDamageSheet`
- `MidiDependentDocument`
- `MidiEnchantActivity`
- `MidiEnchantSheet`
- `MidiForwardActivity`
- `MidiForwardSheet`
- `MidiHealActivity2`
- `MidiHealSheet`
- `MidiItem`
- `MidiRegionDocument`
- `MidiSaveActivity2`
- `MidiSaveSheet`
- `MidiSummonActivity`
- `MidiSummonSheet`
- `MidiTokenDocument`
- `MidiTransformActivity`
- ... y 27 más

## README (excerpt)
```markdown
# Midi-QOL

![](https://img.shields.io/badge/Foundry-v14-informational)
![](https://img.shields.io/badge/Dnd5e-v5.2.4+-informational)
![](https://img.shields.io/badge/Dnd5e-v5.3+-informational)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fmidi-qol&colorB=4aa94a)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/tposney)

### Join our Discord community
<a href="https://discord.gg/Xd4NEvw5d7"><img src="https://img.shields.io/discord/915186263609454632?logo=discord" alt="chat on Discord"></a>

**Midi-QOL** is an automation module for D&D 5e in Foundry VTT that streamlines combat and spellcasting.

## Key Features

| Feature | Description |
|---------|-------------|
| **Automated Rolls** | Auto-roll attacks, damage, and saving throws with configurable fast-forward options |
| **Hit Detection** | Automatic hit/miss calculation comparing attack rolls against target AC |
| **Damage Application** | One-click damage application with support for resistances, immunities, and vulnerabilities |
| **Saving Throws** | Automated save prompts with configurable player/GM rolling and timeout options |
| **Active Effects** | Automatic application of item effects to targets based on hits/saves |
| **Concentration** | Automatic concentration tracking with constitution save prompts on damage |
| **Reactions** | Support for reaction prompts (opportunity attacks, Shield, Counterspell, etc.) |
| **Targeting** | Template-based auto-targeting, range checking, and cover calculation |
| **Combo Cards** | Consolidated chat cards showing attack, damage, hits, and saves in one message |
| **Flanking/Flanked** | Optional flanking/flanked rules with multiple calculation methods |
| **OverTime Effects** | Damage/saves at start/end of turn (burning, poison, hold person, etc.) |
| **Undo System** | Revert recent rolls and damage application |
| **Macro Integration** | OnUse macros, damage bonus macros, and hooks for extending item functionality |

Midi-QOL is highly configurable with quick-start presets for common play styles, from full automation to completely manual rolling.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation & Compatibility](#installation--compatibility)
- [Configuration Reference](#configuration-reference)
- [Features Guide](#features-guide)
- [Flags Reference](#flags-reference)
- [Optional Rules](#optional-rules)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [For Developers](#for-developers)
- [Changelog & Credits](#changelog--credits)

## Other Pages

- [Flags](/FLAGS.md)
- [Flowchart](/docs/flowchart.md)
- [Getting Started](/Getting%20Started.md)
- [Macros](/MACROS.md)
- [Workflow Fields](/docs/workflowfields.md)

---

# Quick Start

## Minimum Setup

1. **Install required modules:**
   - DAE (Dynamic Active Effects)
   - libwrapper
   - socketlib

2. **Enable workflow automation** 
```
