# Monk's Little Details (monks-little-details) — v14.01

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 14–∞ (verificado: 14)

## Hooks (21 encontrados)
- `canvasReady`
- `changeSidebarTab`
- `collapseSidebar`
- `getActorContextOptions`
- `getFolderContextOptions`
- `getSceneControlButtons`
- `init`
- `pauseGame`
- `preUpdateToken`
- `ready`
- `renderActorSheetV2`
- `renderAmbientSoundConfig`
- `renderChatMessageHTML`
- `renderCompendium`
- `renderDocumentDirectory`
- `renderFilePicker`
- `renderMainMenu`
- `renderModuleManagement`
- `renderSceneConfig`
- `renderSettingsConfig`
- `renderUserConfig`

## Classes (1 encontradas)
- `MonksLittleDetails`

## README (excerpt)
```markdown
# Monk's Little Details
A bunch of quality of life improvements to make your games run smoother.

## Installation
Simply use the install module screen within the FoundryVTT setup

## Usage & Current Features

### Core Css Changes
The images displayed for the filepicker and compendiums crops the image if it's not square, due to the object-fit being set to cover.  I think it looks a bit better as contain instead. 

Before

![monks-little-details](/screenshots/CoreCssBefore.webp)

After

![monks-little-details](/screenshots/CoreCssAfter.webp)

I also changed the scene compendium items to more closely match the styling used on the scene tab.  The wider image gives you a better idea of what you're seeing.  There's also an additional button to open the scene as an image instead of as a configuration.  This is useful to see what scene you have before importing it.

Scene Compendium

![monks-little-details](/screenshots/SceneCompendium.png)

Also added changes to the chat sidebar so that it doesn't have a transparent background.  This can be really distracting if you're moving around the map and the chat sidebar is open.  Now it has a solid background so you can see the text more clearly.

### Altered Status Effects
I can never remember what the icons stand for.  So you can now see the text along side the images, and have them sorted either in rows or in columns.  This makes finding them a lot easier.  Also a clear all button has been added in case you want to get rid of all the statuses quickly.  And each item is highlighted in bold orange so it's easier at a glance to see what's been selected.  And added some more of the standard statuses you might encounter in a 5e game.

![monks-little-details](/screenshots/TokenHUDUpdates.webp)

### Changed the invisible image
Changed the invisible icon from the standard Masked Man image to one that more closely resembles a 5e graphic.

### Dominant Scene Colours
Added the top 5 dominant colours of a scene so that you can choose a background colour that blends with the scene a bit better.

![monks-little-details](/screenshots/BackgroundPalette.png)

You can also use this to find the dominant colour in your player avatar and change your player colour to one of the top 5.

![monks-little-details](/screenshots/PlayerPalette.png)

### GM Move characters
If you select characters, hold down the M Key and clicking on another map location, or holding down the M key and dragging the tokens will instantly move them there.  I found dragging them there has unfortunate side effects of showing spaces they shouldn't see while they're moving.  Teleporting them there preserves the fog of war between the two spots.  Handy for when you're using a map that has multiple levels on one image.  You can teleport from one area to the other quickly.

### Swap tools by holding down a key
Monks Little Details will let you briefly activate another tool by holding down a key.  Pressing Shift+key will change the tool.  This allows you to switch br
```
