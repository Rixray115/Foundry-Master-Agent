# Coven's Automation Toolkit (cat) — v0.0.6

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 14–14 (verificado: 14)

## API Surface
### Globals
- `globalThis.cat` / `game.cat`
- `globalThis.title` / `game.title`
- `globalThis.icon` / `game.icon`

## Hooks (11 encontrados)
- `catInit`
- `catReady`
- `ddb-importer.compendiumCreationComplete`
- `dnd5e.preRollAbilityCheck`
- `dnd5e.preRollSavingThrow`
- `dnd5e.preRollSkill`
- `i18nInit`
- `init`
- `libWrapper.Ready`
- `ready`
- `setup`

## Classes (88 encontradas)
- `ActivityMedkit`
- `ActorMedkit`
- `AlternateAttribute`
- `Animation`
- `AttributeRestriction`
- `AuraEvent`
- `AuraTrigger`
- `Automation`
- `BaseRollEvent`
- `BaseWorkflowEvent`
- `CalledEvent`
- `CalledTrigger`
- `CatCombobox`
- `CatCompendiumBrowser`
- `CatEvent`
- `CatMultiCombobox`
- `CatRollResolver`
- `CheckEvent`
- `CheckTrigger`
- `CombatEvent`
- `CombatTrigger`
- `CompendiumMedkit`
- `Crosshairs`
- `DialogApp`
- `DialogManager`
- `DocPropertyEditorApp`
- `EffectEvent`
- `EffectMedkit`
- `EffectTrigger`
- `EmbeddedMacroEditorApp`
- ... y 58 más

## README (excerpt)
```markdown
# Coven's Automation Toolkit (CAT)

An API module for Midi-QOL based automation. Previously a part of Cauldron of Plentiful Resources, now more user-friendly and with expanded capabilities. This module does not provide any automations and is intended for module authors and macro writers to use to create premade automations. For support, please join the [Coven's discord server](https://discord.gg/BumxBcQDrT).

Find detailed information in [our wiki](https://github.com/chrisk123999/covens-automation-toolkit/wiki).

### The Coven:
[Chris](https://github.com/chrisk123999) - [Ko-fi](https://ko-fi.com/chrisk123999) [Patreon](https://www.patreon.com/cw/automatedcraftedcreations)<br> 
[Tyler](https://github.com/Sayshal) - [Ko-fi](https://ko-fi.com/sayshal) [Patreon](https://www.patreon.com/3deathsaves)<br>
[Michael](https://github.com/roth-michael) - [Ko-fi](https://ko-fi.com/hi25114)<br>
[Bacon](https://github.com/bacon-nugget) <br>
[Autumn](https://github.com/Autumn225) - [Ko-fi](https://ko-fi.com/autumn225) <br>
[SagaTympana](https://github.com/SagaTympana)
  
# Requirements & Versions  :
| Module | Min | Max |  
| --- | --- | --- |
| Foundry | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.compatibility.minimum&label=%20&color=orange) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.compatibility.maximum&label=%20&color=orange) 
| D&D 5e System | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.systems%5B%3A1%5D.compatibility.minimum&label=%20&color=yellow) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.systems%5B%3A1%5D.compatibility.maximum&label=%20&color=yellow) |
| Midi-Qol | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.requires%5B0%5D.compatibility.minimum&label=%20&color=green) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.requires%5B0%5D.compatibility.maximum&label=%20&color=green) |
| Dynamic Active Effects | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fchrisk123999%2Fcovens-automation-toolkit%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=%24.relationships.requ
```
