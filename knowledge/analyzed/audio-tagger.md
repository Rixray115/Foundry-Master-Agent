# Audio Tagger (audio-tagger) — v1.5.4

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 13–∞ (verificado: 14)

## Hooks (7 encontrados)
- `audioTaggerTagDeleted`
- `audioTaggerTagUpdated`
- `createPlaylist`
- `createPlaylistSound`
- `init`
- `ready`
- `renderPlaylistDirectory`

## README (excerpt)
```markdown
# Audio Tagger

A customizable tag management system for Foundry VTT playlists.

![Foundry v13](https://img.shields.io/badge/Foundry-v13-informational)
![Version](https://img.shields.io/badge/Version-1.5.3-green)

## Overview

Audio Tagger is a comprehensive module for Foundry VTT that provides powerful tagging and organizational features for your audio playlists and individual sounds. Quickly categorize and find audio content with an intuitive tag-based system designed for Game Masters.

## Features

### Tag Management
- **Custom Tags**: Create unlimited tags with custom names, colors, and emoji icons
- **Tag Folders**: Organize tags hierarchically with folder mode
- **Drag & Drop**: Reorder tags and move them between folders via drag-and-drop
- **Smart Color Presets**: Configurable color palette for quick tag styling
- **31 Default Tags**: Pre-configured tags for common use cases (Ambient, Battle, Forest, etc.)

### Audio Organization
- **Flexible Assignment**: Assign multiple tags to playlists and individual sounds
- **Tag Wizard**: Bulk tag assignment mode with visual indicators
- **Smart Playlists**: Auto-populate playlists based on tag selection (inclusive/exclusive modes)
- **Inheritance**: Sounds inherit parent playlist tags for hierarchical playback

### Search & Playback
- **Native Search Integration**: Find audio by tags using Foundry's built-in search
- **Multi-Word Search**: AND logic for multiple search terms with partial matching
- **Hotkey Playback**: Play first/last/random matching sound with configurable hotkeys (O, L, K)
- **Tag Hierarchy Playback**: Nested folder tags filter sounds by full hierarchy chain

### Customization
- **Sorting Options**: Sort by name (A-Z, Z-A), brightness (dark/light), or custom order
- **Toggle Icons**: Show/hide emoji icons on default tags
- **Header Optimization**: Optional compact playlist headers
- **Notification Control**: Enable/disable notification messages
- **Multi-language**: English and Russian localization

## Installation

### Via Foundry VTT
1. Open Module Settings → Install Module
2. Paste manifest URL: `https://github.com/salamander-git/audio-tagger/releases/latest/download/module.json`
3. Click Install

### Manual
1. Download from [Releases](https://github.com/salamander-git/audio-tagger/releases)
2. Extract to `Data/modules/audio-tagger`
3. Restart Foundry

## Quick Start

### Creating Tags
1. Open Playlist Directory
2. Click **+ Create Tag** in the Audio Tagger palette
3. Set name, color, and optional emoji icon
4. Enable "Folder Mode" to create tag folders

### Assigning Tags
**Quick Method**: Use the Tag Wizard button (wand icon) to enter bulk assignment mode, then click + buttons next to each playlist/sound.

**Direct Method**: Tags appear below playlist/sound names — click × to remove.

### Smart Playlists
1. Open a playlist's configuration
2. In the Smart Playlist section, select desired tags
3. Choose inclusi
```
