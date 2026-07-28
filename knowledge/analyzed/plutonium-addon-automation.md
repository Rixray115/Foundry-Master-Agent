# Plutonium Addon: Automation (plutonium-addon-automation) — v0.8.4

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 13–∞ (verificado: 13.347)

## Public Methods
- `api_GetExpandedAddonData()`
- `api_pGetExpandedAddonData()`

## Hooks (4 encontrados)
- `AutomatedAnimations-WorkflowStart`
- `init`
- `midi-qol.RollComplete.${conditionItemUuid}`
- `ready`

## Classes (19 encontradas)
- `Api`
- `DDBEffectHelper`
- `DDBMacros`
- `DataManager`
- `DataSourceBase`
- `DataSourceIntegrations`
- `DataSourceSelf`
- `DialogHelper`
- `IntegrationBase`
- `IntegrationChrisPremades`
- `Integrations`
- `Main`
- `ModuleSettingConsts`
- `OptionalDependenciesManager`
- `SettingsManager`
- `SharedConsts`
- `Util`
- `_ChrisPremadesNameMappings`
- `extends`

## README (excerpt)
```markdown
# Plutonium Addon: Automation

*Plutonium Addon: Automation* is a module to extend Plutonium, for the purpose of marrying the importation of D&D 5e game material with the automation provided by the 'Midi ecosystem'.

- [Disclaimer](#disclaimer)
- [How it works](#how-it-works)
- [Installation](#installation)
   - [Dependencies and incompatibilities](#dependencies-and-incompatibilities)
   - [**Required** set-up](#required-set-up) (⚠️ **read this!**)
   - [Optional integrations](#optional-integrations)
- [Contributing](#contributing)

---

## Disclaimer

*Plutonium Addon: Automation* is **_not_** supported by any of the modules listed below. If you encounter an issue in your game, disable *Plutonium* and *Plutonium Addon: Automation* and try again. If an issue persists, consider raising an [issue](https://github.com/TheGiddyLimit/plutonium-addon-automation/issues) or asking about it in our [Discord server](https://discord.gg/5etools) before bringing it to the attention of other module authors.

> [!WARNING]
> Some places discourage discussion of *Plutonium* and *Plutonium Addon: Automation*. Be aware of any rules before mentioning these modules outside this repo and our [Discord server](https://discord.gg/5etools).

## How it works

*Plutonium Addon: Automation* runs invisibly and (mostly) silently.

While the module is activated in your world, each time Plutonium would import a document, it will check if any automation data is available for that document. If so, it will import the document with the additional automation data included. If not, it will import the document as if *Plutonium Addon: Automation* were not enabled (although sometimes slightly and non-destructively tweaked for better compatibility with the modules below).

> [!TIP]
> **There's no need to import everything prematurely**, 'just in case'. As with Plutonium, all data is included in the module itself, and, if you use any [module integrations](#optional-integrations), you'll be missing out on updates from them.

## Installation

You can install the module using the following manifest URL:

`https://github.com/TheGiddyLimit/plutonium-addon-automation/releases/latest/download/module.json`

### Dependencies and incompatibilities

Besides *Plutonium* itself, *Plutonium Addon: Automation* **requires**:
- [Dynamic Active Effects](https://foundryvtt.com/packages/dae) (DAE)
- [Midi QoL](https://foundryvtt.com/packages/midi-qol)
- [Times Up](https://foundryvtt.com/packages/times-up)

Some specific automations require one or more additional modules:
- [Active-Auras](https://foundryvtt.com/packages/ActiveAuras)

If you import a document which requires one of these modules, you will be prompted to install/activate it. The automation is highly unlikely to function as intended if you use it before activating the module.

> [!CAUTION]
> *Plutonium Addon: Automation* is designed for the extensive automation provided by the 'Midi ecosystem' and, as such, *isn't* designed for modules such as [Whis
```
