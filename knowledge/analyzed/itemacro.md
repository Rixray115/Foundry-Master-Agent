# Item Macro (itemacro) — v3.0.1

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 13–∞ (verificado: 13.344)

## Hooks (5 encontrados)
- `getHeaderControlsApplicationV2`
- `getItemDirectoryEntryContext`
- `init`
- `ready`
- `renderItemSheet`

## README (excerpt)
```markdown
# Item Macro
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Foundry-Workshop/Item-Macro?style=for-the-badge) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FFoundry-Workshop%2FItem-Macro%2Fmaster%2Fmodule.json&label=Foundry%20Min%20Version&query=$.compatibility.minimum&colorB=orange&style=for-the-badge) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FFoundry-Workshop%2FItem-Macro%2Fmaster%2Fmodule.json&label=Foundry%20Verified&query=$.compatibility.verified&colorB=orange&style=for-the-badge)  
![License](https://img.shields.io/github/license/Foundry-Workshop/Item-Macro?style=for-the-badge) ![GitHub Releases](https://img.shields.io/github/downloads/Foundry-Workshop/Item-Macro/latest/module.zip?style=for-the-badge) ![GitHub All Releases](https://img.shields.io/github/downloads/Foundry-Workshop/Item-Macro/module.zip?style=for-the-badge&label=Downloads+total)  
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white&link=https%3A%2F%2Fdiscord.gg%2FXkTFv8DRDc)](https://discord.gg/XkTFv8DRDc)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://www.patreon.com/foundryworkshop)
[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/forien)

This is a FoundryVTT module for the multiple systems (list below). It allow macros to be saved inside of an item and for various different ways to execute macros.  

You can execute the macro from the "item" class using the executeMacro(...args) function, from the character sheet (if the settings are satisfied to do so), from the hotbar using the default rollItemMacro function for your system (if the settings are satisfied to do so), or from token-action-hud.

# Installation

_**Item Macro v2.1.0 onwards will not work with DnD 5e 3.3.1**_   
_If you do not use the newest version of the DnD 5e system, please do not update Item Macro and install v2.0.1 instead using [this manifest link](https://github.com/Foundry-Workshop/Item-Macro/releases/download/v2.0.1/module.json)._  
_You can read more about these changes in [v2.1.0 Release](https://github.com/Foundry-Workshop/Item-Macro/releases/tag/v2.1.0) notes._

_**Item Macro v1.11.0 onwards will not work with DnD 5e 2.4.**_   
_If you do not use the newest version of the DnD 5e system, please do not update Item Macro and install v1.10.5 instead using [this manifest link](https://github.com/Foundry-Workshop/Item-Macro/releases/download/v1.10.5/module.json)._  
_You can read more about these changes in [v1.11.0 Release](https://github.com/Foundry-Workshop/Item-Macro/releases/tag/v1.11.0) notes._

1. Inside Foundry's Configuration and Setup screen, go to **Add-on Modules**
2. Click "Install Module"
3. Install modul
```
