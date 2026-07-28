# libWrapper (lib-wrapper) — v1.13.5.1

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 0.6.5–∞ (verificado: 14)

## Hooks (8 encontrados)
- `${i}.ConflictDetected`
- `${i}.OverrideLost`
- `${i}.Ready`
- `${i}.Register`
- `${i}.Unregister`
- `${i}.UnregisterAll`
- `init`
- `ready`

## Classes (16 encontradas)
- `IgnoredConflictEntry`
- `LibWrapperAlreadyOverriddenError`
- `LibWrapperConflicts`
- `LibWrapperError`
- `LibWrapperInternalError`
- `LibWrapperInvalidWrapperChainError`
- `LibWrapperNotifications`
- `LibWrapperPackageError`
- `LibWrapperSettings`
- `LibWrapperStats`
- `Log`
- `PackageInfo`
- `Wrapper`
- `WrapperStorage`
- `i18n`
- `libWrapper`

## README (excerpt)
```markdown
# 1. FVTT libWrapper
Library for [Foundry VTT](https://foundryvtt.com/) which provides package developers with a simple way to modify core Foundry VTT code, while reducing the likelihood of conflict with other packages and making troubleshooting easier.

[![License](https://img.shields.io/github/license/ruipin/fvtt-lib-wrapper)](LICENSE)
[![Build Release](https://github.com/ruipin/fvtt-lib-wrapper/workflows/Build%20Release/badge.svg)](https://github.com/ruipin/fvtt-lib-wrapper/releases/latest)
[![Version (latest)](https://img.shields.io/github/v/release/ruipin/fvtt-lib-wrapper)](https://github.com/ruipin/fvtt-lib-wrapper/releases/latest)
[![Foundry Version](https://img.shields.io/badge/dynamic/json.svg?url=https://github.com/ruipin/fvtt-lib-wrapper/releases/latest/download/module.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=blueviolet)](https://github.com/ruipin/fvtt-lib-wrapper/releases/latest)
[![GitHub downloads (latest)](https://img.shields.io/badge/dynamic/json?label=Downloads@latest&query=assets[?(@.name.includes('zip'))].download_count&url=https://api.github.com/repos/ruipin/fvtt-lib-wrapper/releases/latest&color=green)](https://github.com/ruipin/fvtt-lib-wrapper/releases/latest)
[![Forge Install Base](https://img.shields.io/badge/dynamic/json?label=Forge%20Install%20Base&query=package.installs&suffix=%&url=https://forge-vtt.com/api/bazaar/package/lib-wrapper&colorB=brightgreen)](https://forge-vtt.com/)
[![GitHub issues](https://img.shields.io/github/issues-raw/ruipin/fvtt-lib-wrapper)](https://github.com/ruipin/fvtt-lib-wrapper/issues)
[![Ko-fi](https://img.shields.io/badge/-buy%20me%20a%20coffee-%23FF5E5B?logo=Ko-fi&logoColor=white)](https://ko-fi.com/ruipin)

- [1. FVTT libWrapper](#1-fvtt-libwrapper)
  - [1.1. Why?](#11-why)
  - [1.2. Installation](#12-installation)
    - [1.2.1. As a Module](#121-as-a-module)
    - [1.2.2. As a Library](#122-as-a-library)
    - [1.2.3. As a Contributor](#123-as-a-contributor)
  - [1.3. Usage](#13-usage)
    - [1.3.1. Summary](#131-summary)
    - [1.3.2. Common Issues and Pitfalls](#132-common-issues-and-pitfalls)
      - [1.3.2.1. Not allowed to register wrappers before the `init` hook.](#1321-not-allowed-to-register-wrappers-before-the-init-hook)
      - [1.3.2.2. LISTENER and OVERRIDE wrappers have a different call signature](#1322-listener-and-override-wrappers-have-a-different-call-signature)
      - [1.3.2.3. Arrow Functions do not support `this`](#1323-arrow-functions-do-not-support-this)
      - [1.3.2.4. Using `super` inside wrappers](#1324-using-super-inside-wrappers)
      - [1.3.2.5. Patching Mixins](#1325-patching-mixins)
    - [1.3.3. LibWrapper API](#133-libwrapper-api)
      - [1.3.3.1. Registering a wrapper](#1331-registering-a-wrapper)
      - [1.3.3.2. Unregistering a wrapper](#1332-unregistering-a-wrapper)
      - [1.3.3.3. Unregister all wrappers for a given package](#1333-unregister-all-wrappers-for-a-given-package)
      - [1.3.3.4. Ignore conflicts matching 
```
