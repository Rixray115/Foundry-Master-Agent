# Monk's Sound Enhancements (monks-sound-enhancements) — v14.01

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 14–∞ (verificado: 14)

## API Surface
### Globals
- `globalThis.MonksSoundEnhancements` / `game.MonksSoundEnhancements`

## Hooks (7 encontrados)
- `globalSoundEffectVolumeChanged`
- `hotbarDrop`
- `init`
- `ready`
- `renderJournalPageSheet`
- `renderPlaylistSoundConfig`
- `updateCombat`

## Classes (1 encontradas)
- `MonksSoundEnhancements`

## README (excerpt)
```markdown
# Monk's Sound Enhancements
Add-On Module for Foundry VTT

This is some enhancements to the way Foundry handles playlist and sounds

## Installation
Simply use the install module screen within the FoundryVTT setup

## Usage & Current Features

![monks-sound-enhancements](/screenshots/list.png)

When you open up a playlist configuration, a second tab has been added that will list all the sounds associated with that play list.  This is most helpful when viewing a playlist that is in a compendium as you can now see what sounds are associated with the playlist before importing it.

A play button has been added so you can listen to the sound file personally without needing to play it through the Playlist interface and possibly broadcasting it to the players.

You can drag and drop individual sound files onto play lists.  So you can view a playlist within a compendium, listen to the sound file, and if it's one you'd like to include you can drag and drop it into an active playlist.

Also, if you are importing from a compendium, there will be checkboxes available to individually select files you wish to be included when you import the playlist.  So you no longer need to import the entire list if you only want to include a few tracks.

If you are editing a sound file, dragging another sound file onto the sound config dialog will update all the information with the dropped sound information.

### Hide sound names
You can also hide either the sound name, or the hide the playlist from the players.  In case the name fo ythe sound file reveals something it shouldn't.  This will still allow players to change the volume of the sound being played, btu won't reveal the name of the sound track.

Hiding the playlist will automatically hide the sound files within that playlist

### Character Sound Effects
Added a button to load a sound file to associate with a character.  So if you ever wanted to make a dragon roar, or a banshee howl, you can upload the file, attach it to the character and play from the Token HUD.  From the character sheet, a button with a speaker icon should now be visible.  Clicking that will open a dialog window that will allow you to select a file, adjust the volume and preview the sound effect.  And orange border will denote that a file has been loaded.
![monks-sound-enhancements](/screenshots/AddSound.webp)

While playing, bringing up the Token HUD will show a speaker button under the combat button.  Clicking on the speaker button will play the sound effect using the current volume settings for Foundry.
![monks-sound-enhancements](/screenshots/PlaySound.webp)

You can change what character sheets this button is available for in the settings.  Current options are, `none` to leave the setting off, `everyone` to turn it on all character sheets, and `NPC` to have it only available for NPC character sheets.

You can also set it so the character sound effect play every time the character has a turn in combat.

To see what sound effects are currently 
```
