# Monk's TokenBar (monks-tokenbar) — v14.01

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 14–∞ (verificado: 14)

## API Surface
### Globals
- `globalThis.MonksTokenBar` / `game.MonksTokenBar`

## Hooks (41 encontrados)
- `canvasInit`
- `canvasReady`
- `controlToken`
- `createItem`
- `createToken`
- `deleteCombat`
- `deleteItem`
- `deleteToken`
- `diceSoNiceRollComplete`
- `getSceneControlButtons`
- `init`
- `monks-tokenbar.requestContested`
- `monks-tokenbar.requestRoll`
- `monks-tokenbar.updateContested`
- `monks-tokenbar.updateRoll`
- `preCreateChatMessage`
- `preUpdateChatMessage`
- `preUpdateToken`
- `ready`
- `render`
- `renderChatMessageHTML`
- `renderCombatTracker`
- `renderContestedRollApp`
- `renderJournalPageSheet`
- `renderJournalSheet`
- `renderPrototypeTokenConfig`
- `renderSavingThrowApp`
- `renderSettingsConfig`
- `renderTokenConfig`
- `setup`
- `setupTileActions`
- `tokenBarUpdateRoll`
- `updateActiveEffect`
- `updateActor`
- `updateChatMessage`
- `updateCombat`
- `updateItem`
- `updateOwnedItem`
- `updateSetting`
- `updateToken`
- `updateUser`

## Classes (9 encontradas)
- `AssignXP`
- `AssignXPApp`
- `ContestedRoll`
- `ContestedRollApp`
- `MonksTokenBar`
- `MonksTokenBarAPI`
- `SavingThrow`
- `SavingThrowApp`
- `TokenBar`

## README (excerpt)
```markdown
# Monk's TokenBar

Add-On Module for Foundry VTT

Add a token bar to show the current player tokens that are available on the current scene

## Installation
Simply use the install module screen within the FoundryVTT setup

## Usage & Current Features

![monks-tokenbar](screenshots/TokenBar.webp)

The player tokens currently in the scene are automatically added.  Tokens need to be owned by a player and of friendly disposition to be automatically included in this list.  If you'd like a token to be included or excluded, there is a dropdown menu added to the Token configuration screen that will allow you to manually change this.  Clicking on the token iteself will center the screen on that token.  Occasionaly I find that I lose track of where the players token is and this is an easy way to get to it quickly.

Right click on the token in the TokenBar to open a context menu with options to edit both the character and token, aswell as targeting that token.  You can also set individual movement restrictions for that specific token.

<ins>**If you are having troubles seeing a token on the token bar, please check to make sure the token is set to friendly disposition and is owned by a player**</ins>

### Limit Movement
You can the limit the movement of tokens.  There are three options available, either free movement where tokens can be moved at will, no movement where tokens aren't allowed to be moved, or combat movement, where only the token whose turn is current can move.  You can set the movement individually for each token via the right-click menu.  Doing so is handy if you trust a player to clean up their movement after their turn is done while you move on to the next player.

### Saving Throw Dialog
![monks-tokenbar](screenshots/SavingThrowDialog.webp)
![monks-tokenbar](screenshots/SavingThrowChatMessage.webp)

Clicking on the saving throw button will open a dialog to facilitate a group saving throw.
Select tokens you wish included and click the button to open the dialog.  Select what type of roll to make.  Optionally enter in a DC to beat, this will only show to the GM but will automatically determine if the roll passed or not.  Clicking the Add button will add any selected tokens not already on the list.

Clicking request will add a chat message and prompt players to roll the saving throw requested.  Results will be show depending on the Roll Mode.

### Contested Roll Dialog
![monks-tokenbar](screenshots/ContestedRoll.webp)
![monks-tokenbar](screenshots/ContestedRollChatMessage.webp)

Clicking on the contested roll button will open a dialog to facilitate a contested roll.
If a token is selected and another is set as a target it will automatically fill the two slots.  Otherwise the next token clicked will fill the next avaialble slot.  Individually select what roll each token will make.  
Clicking request will add a chat message and prompt players to roll the contested roll requested.  After both partied have rolled it will show which one won the con
```
