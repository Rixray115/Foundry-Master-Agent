# Tagger (tagger) — v1.6.0

> Generado automáticamente por `analyze-modules.mjs`

⚠️ **Versión difiere del curado**: instalado 1.6.0 vs curado 1.5.4

**Compatibilidad**: Foundry 13–14 (verificado: 14)

## API Surface
### Globals
- `globalThis.Tagger` / `game.Tagger`

## Hooks (6 encontrados)
- `init`
- `preCreate${obj}`
- `preUpdate${obj}`
- `render${configName}`
- `renderPlaceableTab`
- `update${docType}`

## Classes (4 encontradas)
- `TagManager`
- `Tagger`
- `TaggerConfig`
- `TaggerHandler`

## README (excerpt)
```markdown
# Tagger

![Latest Release Download Count](https://img.shields.io/github/downloads/fantasycalendar/FoundryVTT-Tagger/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftagger&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=tagger) ![Foundry Core Minimum Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Ffantasycalendar%2FFoundryVTT-Tagger%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Minimum%20Version&query=$.compatibility.minimum&colorB=orange&style=for-the-badge) ![Foundry Core Verified Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Ffantasycalendar%2FFoundryVTT-Tagger%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Foundry%20Verified%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge) ![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fgithub.com%2Ffantasycalendar%2FFoundryVTT-Tagger%2Freleases%2Flatest%2Fdownload%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

---

<img src="https://app.fantasy-calendar.com/resources/computerworks-logo-full.png" alt="Fantasy Computerworks Logo" style="width:250px;"/>

A module made by [Fantasy Computerworks](http://fantasycomputer.works/).

Other works by us:
- [Fantasy Calendar](https://app.fantasy-calendar.com) - The best calendar creator and management app on the internet
- [Sequencer](https://foundryvtt.com/packages/sequencer) - Wow your players by playing visual effects on the canvas
- [Item Piles](https://foundryvtt.com/packages/item-piles) - Drag & drop items into the scene to drop item piles that you can then easily pick up

Like what we've done? Buy us a coffee!

<a href='https://ko-fi.com/H2H2LCCQ' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

---

## What is Tagger?

This module allows you to put unique tags on objects in scenes and use Tagger's powerful API to quickly retrieve them.

## Placeables Sidebar

On Foundry v14, the new Placeables sidebar tab (which lists every token, tile, light, etc. in the current scene) gets two Tagger features.

### Tag Pills

Each entry in the sidebar shows its tags as pills under the entry's name. No configuration is needed. If a placeable has tags, the pills appear.

### `tag:` Search Prefix

The sidebar's search box accepts `tag:` terms that filter entries by tag. Tag terms can be combined with the regular name search:

| Query | Effect |
| --- | --- |
| `goblin` | Entries whose name contains "goblin" (Foundry's normal name search) |
| `tag:enemy` | Entries that have a tag containing "enemy" |
| `tag:"boss fight"` | Entries that have a tag co
```
