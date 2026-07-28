# Plutonium (plutonium) — v2.16.2.v14

> Generado automáticamente por `analyze-modules.mjs`

⚠️ **Versión difiere del curado**: instalado 2.16.2.v14 vs curado 2.15.0

**Compatibilidad**: Foundry 14–14.999 (verificado: 14.364)

## API Surface
### Globals
- `globalThis.Parser` / `game.Parser`
- `globalThis.IS_DEPLOYED` / `game.IS_DEPLOYED`
- `globalThis.VERSION_NUMBER` / `game.VERSION_NUMBER`
- `globalThis.DEPLOYED_IMG_ROOT` / `game.DEPLOYED_IMG_ROOT`
- `globalThis.IS_VTT` / `game.IS_VTT`
- `globalThis.IMGUR_CLIENT_ID` / `game.IMGUR_CLIENT_ID`
- `globalThis.HASH_PART_SEP` / `game.HASH_PART_SEP`
- `globalThis.HASH_LIST_SEP` / `game.HASH_LIST_SEP`
- `globalThis.HASH_SUB_LIST_SEP` / `game.HASH_SUB_LIST_SEP`
- `globalThis.HASH_SUB_KV_SEP` / `game.HASH_SUB_KV_SEP`
- `globalThis.HASH_BLANK` / `game.HASH_BLANK`
- `globalThis.HASH_SUB_NONE` / `game.HASH_SUB_NONE`
- `globalThis.VeCt` / `game.VeCt`
- `globalThis.StrUtil` / `game.StrUtil`
- `globalThis.NumberUtil` / `game.NumberUtil`
- `globalThis.CleanUtil` / `game.CleanUtil`
- `globalThis.SourceUtil` / `game.SourceUtil`
- `globalThis.CurrencyUtil` / `game.CurrencyUtil`
- `globalThis.ee` / `game.ee`
- `globalThis.TemplateUtil` / `game.TemplateUtil`
- `globalThis.JqueryUtil` / `game.JqueryUtil`
- `globalThis.ElementUtil` / `game.ElementUtil`
- `globalThis.ObjUtil` / `game.ObjUtil`
- `globalThis.MiscUtil` / `game.MiscUtil`
- `globalThis.EventUtil` / `game.EventUtil`
- `globalThis.AnimationUtil` / `game.AnimationUtil`
- `globalThis.ContextUtil` / `game.ContextUtil`
- `globalThis.SearchUtil` / `game.SearchUtil`
- `globalThis.UrlUtil` / `game.UrlUtil`
- `globalThis.SortUtil` / `game.SortUtil`
- `globalThis.MultiSourceUtil` / `game.MultiSourceUtil`
- `globalThis.DataUtil` / `game.DataUtil`
- `globalThis.RollerUtil` / `game.RollerUtil`
- `globalThis.StorageUtilMemory` / `game.StorageUtilMemory`
- `globalThis.StorageUtil` / `game.StorageUtil`
- `globalThis.SessionStorageUtil` / `game.SessionStorageUtil`
- `globalThis.CryptUtil` / `game.CryptUtil`
- `globalThis.CollectionUtil` / `game.CollectionUtil`
- `globalThis.Trie` / `game.Trie`
- `globalThis.ExcludeUtil` / `game.ExcludeUtil`
- `globalThis.ExtensionUtil` / `game.ExtensionUtil`
- `globalThis.VeLock` / `game.VeLock`
- `globalThis.DatetimeUtil` / `game.DatetimeUtil`
- `globalThis.EditorUtil` / `game.EditorUtil`
- `globalThis.BrowserUtil` / `game.BrowserUtil`
- `globalThis.ProxyBase` / `game.ProxyBase`
- `globalThis.ListSelectClickHandlerBase` / `game.ListSelectClickHandlerBase`
- `globalThis.ListSelectClickHandler` / `game.ListSelectClickHandler`
- `globalThis.RenderableCollectionSelectClickHandler` / `game.RenderableCollectionSelectClickHandler`
- `globalThis.ListUiUtil` / `game.ListUiUtil`
- `globalThis.ListUiPreviewButtonHandlerBase` / `game.ListUiPreviewButtonHandlerBase`
- `globalThis.ListUiPreviewButtonHandlerStatsFluff` / `game.ListUiPreviewButtonHandlerStatsFluff`
- `globalThis.TabUiUtil` / `game.TabUiUtil`
- `globalThis.TabUiUtilSide` / `game.TabUiUtilSide`
- `globalThis.BaseComponent` / `game.BaseComponent`
- `globalThis.RenderableCollectionBase` / `game.RenderableCollectionBase`
- `globalThis.RenderableCollectionGenericRows` / `game.RenderableCollectionGenericRows`
- `globalThis.RenderableCollectionAsyncBase` / `game.RenderableCollectionAsyncBase`
- `globalThis.UiUtil` / `game.UiUtil`
- `globalThis.ProfUiUtil` / `game.ProfUiUtil`
- `globalThis.SearchUiUtil` / `game.SearchUiUtil`
- `globalThis.SearchWidget` / `game.SearchWidget`
- `globalThis.InputUiUtil` / `game.InputUiUtil`
- `globalThis.DragReorderUiUtil` / `game.DragReorderUiUtil`
- `globalThis.ComponentUiUtil` / `game.ComponentUiUtil`
- `globalThis.UtilsChangelog` / `game.UtilsChangelog`
- `globalThis.Renderer` / `game.Renderer`
- `globalThis.RendererMarkdown` / `game.RendererMarkdown`
- `globalThis.MarkdownConverter` / `game.MarkdownConverter`
- `globalThis.Hist` / `game.Hist`
- `globalThis.FILTER_BOX_EVNT_VALCHANGE` / `game.FILTER_BOX_EVNT_VALCHANGE`
- `globalThis.FILTER_BOX_TITLE_BTN_RESET` / `game.FILTER_BOX_TITLE_BTN_RESET`
- `globalThis.PageFilterBase` / `game.PageFilterBase`
- `globalThis.ModalFilterBase` / `game.ModalFilterBase`
- `globalThis.FilterBox` / `game.FilterBox`
- `globalThis.FilterItem` / `game.FilterItem`
- `globalThis.FilterItemClassSubclass` / `game.FilterItemClassSubclass`
- `globalThis.FilterBase` / `game.FilterBase`
- `globalThis.Filter` / `game.Filter`
- `globalThis.SearchableFilter` / `game.SearchableFilter`
- `globalThis.SourceFilterItem` / `game.SourceFilterItem`
- `globalThis.SourceFilter` / `game.SourceFilter`
- `globalThis.AbilityScoreFilter` / `game.AbilityScoreFilter`
- `globalThis.RangeFilter` / `game.RangeFilter`
- `globalThis.OptionsFilter` / `game.OptionsFilter`
- `globalThis.MultiFilter` / `game.MultiFilter`
- `globalThis.PageFilterClassesBase` / `game.PageFilterClassesBase`
- `globalThis.PageFilterClasses` / `game.PageFilterClasses`
- `globalThis.BlocklistUtil` / `game.BlocklistUtil`
- `globalThis.BlocklistUi` / `game.BlocklistUi`
- `globalThis.PageFilterActions` / `game.PageFilterActions`
- `globalThis.PageFilterBackgrounds` / `game.PageFilterBackgrounds`
- `globalThis.ModalFilterBackgrounds` / `game.ModalFilterBackgrounds`
- `globalThis.PageFilterBastions` / `game.PageFilterBastions`
- `globalThis.PageFilterBestiary` / `game.PageFilterBestiary`
- `globalThis.ModalFilterBestiary` / `game.ModalFilterBestiary`
- `globalThis.ListSyntaxBestiary` / `game.ListSyntaxBestiary`
- `globalThis.PageFilterCharCreationOptions` / `game.PageFilterCharCreationOptions`
- `globalThis.FilterCommon` / `game.FilterCommon`
- `globalThis.PageFilterConditionsDiseases` / `game.PageFilterConditionsDiseases`
- `globalThis.PageFilterCultsBoons` / `game.PageFilterCultsBoons`
- `globalThis.PageFilterDecks` / `game.PageFilterDecks`
- `globalThis.ListSyntaxDecks` / `game.ListSyntaxDecks`
- `globalThis.PageFilterDeities` / `game.PageFilterDeities`
- `globalThis.ListSyntaxDeities` / `game.ListSyntaxDeities`
- `globalThis.PageFilterFeats` / `game.PageFilterFeats`
- `globalThis.ModalFilterFeats` / `game.ModalFilterFeats`
- `globalThis.PageFilterEquipment` / `game.PageFilterEquipment`
- `globalThis.PageFilterItems` / `game.PageFilterItems`
- `globalThis.ModalFilterItems` / `game.ModalFilterItems`
- `globalThis.ListSyntaxItems` / `game.ListSyntaxItems`
- `globalThis.PageFilterLanguages` / `game.PageFilterLanguages`
- `globalThis.PageFilterObjects` / `game.PageFilterObjects`
- `globalThis.ListSyntaxObjects` / `game.ListSyntaxObjects`
- `globalThis.PageFilterOptionalFeatures` / `game.PageFilterOptionalFeatures`
- `globalThis.ModalFilterOptionalFeatures` / `game.ModalFilterOptionalFeatures`
- `globalThis.PageFilterPsionics` / `game.PageFilterPsionics`
- `globalThis.ListSyntaxPsionics` / `game.ListSyntaxPsionics`
- `globalThis.PageFilterRaces` / `game.PageFilterRaces`
- `globalThis.ModalFilterRaces` / `game.ModalFilterRaces`
- `globalThis.PageFilterRecipes` / `game.PageFilterRecipes`
- `globalThis.ListSyntaxRecipes` / `game.ListSyntaxRecipes`
- `globalThis.PageFilterRewards` / `game.PageFilterRewards`
- `globalThis.PageFilterSpells` / `game.PageFilterSpells`
- `globalThis.ModalFilterSpells` / `game.ModalFilterSpells`
- `globalThis.ListSyntaxSpells` / `game.ListSyntaxSpells`
- `globalThis.PageFilterTables` / `game.PageFilterTables`
- `globalThis.ListSyntaxTables` / `game.ListSyntaxTables`
- `globalThis.PageFilterTrapsHazards` / `game.PageFilterTrapsHazards`
- `globalThis.ListSyntaxTrapsHazards` / `game.ListSyntaxTrapsHazards`
- `globalThis.PageFilterVariantRules` / `game.PageFilterVariantRules`
- `globalThis.PageFilterVehicles` / `game.PageFilterVehicles`
- `globalThis.ListSyntaxVehicles` / `game.ListSyntaxVehicles`
- `globalThis.ListItem` / `game.ListItem`
- `globalThis.List` / `game.List`
- `globalThis.FoundryOmnidexerUtils` / `game.FoundryOmnidexerUtils`
- `globalThis.Omnidexer` / `game.Omnidexer`
- `globalThis.IndexableFileQuickReference` / `game.IndexableFileQuickReference`
- `globalThis.FontManager` / `game.FontManager`
- `globalThis.BrewUtilShared` / `game.BrewUtilShared`
- `globalThis.PrereleaseUtil` / `game.PrereleaseUtil`
- `globalThis.BrewUtil2` / `game.BrewUtil2`
- `globalThis.VetoolsConfig` / `game.VetoolsConfig`
- `globalThis.ConfigUi` / `game.ConfigUi`
- `globalThis.DataLoader` / `game.DataLoader`
- `globalThis.ScaleCreature` / `game.ScaleCreature`
- `globalThis.ScaleSpellSummonedCreature` / `game.ScaleSpellSummonedCreature`
- `globalThis.ScaleClassSummonedCreature` / `game.ScaleClassSummonedCreature`
- `globalThis.fromUuid` / `game.fromUuid`
- `globalThis.fromUuidSync` / `game.fromUuidSync`
- `globalThis.plutonium` / `game.plutonium`
- `globalThis.e_` / `game.e_`
- `globalThis.es` / `game.es`
- `globalThis.em` / `game.em`
- `globalThis.onhashchange` / `game.onhashchange`
- `globalThis.PLUT_CONTEXT` / `game.PLUT_CONTEXT`
- `globalThis.resizable` / `game.resizable`
- `globalThis.CONST` / `game.CONST`

## Public Methods
- `api_AddFont()`
- `api_AddItemGrantAdvancementLinks()`
- `api_AddToIndexes()`
- `api_ApplyCustomHashId()`
- `api_ApplyFormDataToActor()`
- `api_AutoDecodeHash()`
- `api_BuildCache()`
- `api_BuildFluffTab()`
- `api_BuildList()`
- `api_CacheAndGet()`
- `api_CacheAndGetAll()`
- `api_CacheAndGetAllBrew()`
- `api_CacheAndGetAllPrerelease()`
- `api_CacheAndGetAllSite()`
- `api_CacheAndGetHash()`
- `api_CacheAndGetWeaponItem()`
- `api_CacheAndGetWeaponItemApprox()`
- `api_CopyBlobToClipboard()`
- `api_CopyImageToLocalViaBackend()`
- `api_CopyTextToClipboard()`
- `api_CreateAdvancementBackingItem()`
- `api_CreateDocument()`
- `api_CreateEmbeddedDocuments()`
- `api_CreateFoldersGetId()`
- `api_CreateImageGetUrl()`
- `api_CreateTempFolderGetId()`
- `api_CreateToken()`
- `api_DeleteAllAuthoredMessagesByContentMatch()`
- `api_DeleteEmbeddedDocuments()`
- `api_DeleteMessage()`
- ... y 291 más

## Hooks (45 encontrados)
- `${SharedConsts.MODULE_ID_FAKE}.configUpdate`
- `${SharedConsts.SYSTEM_ID_DND5E}.postUseActivity`
- `activateNote`
- `canvasReady`
- `closeApplication`
- `createActor`
- `createFolder`
- `createToken`
- `deleteActor`
- `deleteChatMessage`
- `deleteFolder`
- `deleteScene`
- `drawToken`
- `dropCanvasData`
- `fs-addCustomPacks`
- `fs-addWrapperClasses`
- `get${hookName}ContextOptions`
- `getActorContextOptions`
- `getCompendiumContextOptions`
- `getSceneContextOptions`
- `getSceneControlButtons`
- `init`
- `preCreateItem`
- `preUpdateItem`
- `ready`
- `refreshToken`
- `render${hkName}`
- `renderActiveEffectConfig`
- `renderActorSheet`
- `renderActorSheetV2`
- `renderApplication`
- `renderChatLog`
- `renderChatMessageHTML`
- `renderChooseImporter`
- `renderCompendiumDirectory`
- `renderKeybindingsConfig`
- `renderModuleManagement`
- `renderSettingsConfig`
- `setup`
- `spotlightOmnisearch.indexBuilt`
- `tidy5e-sheet.ready`
- `updateActor`
- `updateCompendium`
- `updateFolder`
- `updateScene`

## Classes (1705 encontradas)
- `AbilityScoreFilter`
- `ActiveEffectMeta`
- `ActivitiesConsumptionTargetMutatorEntityReference`
- `ActivitiesConsumptionTargetMutatorResourceConsumption`
- `ActivityBuilderBase`
- `ActivityBuilderGenericCheck`
- `ActivityBuilderGenericDamage`
- `ActivityBuilderGenericHeal`
- `ActivityBuilderGenericUtility`
- `ActivityBuilderItemWeaponAttack`
- `ActivityBuilderNonPlayerAttack`
- `ActivityBuilderNonPlayerBase`
- `ActivityBuilderNonPlayerSave`
- `ActivityBuilderPlayerAttack`
- `ActivityBuilderPlayerBase`
- `ActivityBuilderPlayerHeal`
- `ActivityBuilderPlayerSave`
- `ActivityBuilderPlayerUtility`
- `ActivityBuilderSpellAttack`
- `ActivityBuilderSpellBase`
- `ActivityBuilderSpellCheck`
- `ActivityBuilderSpellFauxCast`
- `ActivityBuilderSpellHeal`
- `ActivityBuilderSpellSave`
- `ActivityBuilderSpellSummon`
- `ActorAbilityScoreIncrease`
- `ActorItemCleaner`
- `ActorMultiImportHelper`
- `ActorMultiattack`
- `ActorPolymorpher`
- ... y 1675 más

## README (excerpt)
```markdown
### Installation

- Copy the directory containing this README to `%appdata%/../Local/FoundryVTT/Data/modules`
- Restart Foundry
- In Foundry, go to the "Settings" ("?") tab, click "Manage Modules," and enable "Plutonium." Be sure to save the changes by clicking "Update Modules."

---

### Rivet

A companion browser extension, "Rivet," is available on the [Chrome](https://chrome.google.com/webstore/detail/rivet/igmilfmbmkmpkjjgoabaagaoohhhbjde) and [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/rivet/) web stores. With Rivet, you can one-click import content (notably creatures as a GM, or spells as a player) when browsing 5etools.

---

### Server-Side Modding

_**Note: Local/dedicated installs only!** You cannot use this with hosting services, such as Forge. Turn back now._

⚠️ Modifying server-side code can/will introduce security vulnerabilities, making your game more susceptible to attack. Some known vulnerabilities are highlighted below, but this is not a complete list. ⚠️

Plutonium comes with a server-side mod to enable mass-downloading via the built-in Art Browser. To install this:

- Find Foundry's `main.mjs` file in:
   - If you installed "for current user only" on Windows: `%appdata%/../Local/Programs/FoundryVTT/resources/app`
   - If you installed "for all users" on Windows: `Program Files/FoundryVTT/resources/app`
- Edit the file, changing this:
```js
init.default({
	args: process.argv,
	root: root,
	messages: startupMessages,
	debug: isDebug
})
```

to

```js
await init.default({
	args: process.argv,
	root: root,
	messages: startupMessages,
	debug: isDebug
});
(await import("./plutonium-backend.mjs")).Plutonium.init();
```
- Copy the `plutonium-backend.mjs` file from `server/<foundry version>/` to the directory containing `main.mjs`
- Launch Foundry, and pray that nothing explodes. If everything is working, the in-game Foundry logo (in the top-left of the screen) will show the running Plutonium backend version.

#### Additional Server-Side Addons

##### Custom Setup Screen Addon

This addon allows custom CSS and JavaScript to be loaded when viewing the setup screen, allowing additional styling/functionality to be applied.

⚠️ Enabling this addon allows any user with upload permissions to create potentially-malicious scripts and styles which will automatically be executed when a client visits the setup page. ⚠️

Installation: copy the `plutonium-backend-addon-custom-setup.mjs` file to the same directory as `plutonium-backend.mjs`.

Usage: create a `setup.css` and/or a `setup.js` in your Foundry data folder (alongside the `modules`, `systems`, and `worlds` directories). These files will then be loaded, if they exist, when a client visits the setup screen (`/setup`).

Examples can be found in the `server/<foundry version>/custom-setup-samples` directory.

##### Custom World Login Screen Addon

This addon allows custom CSS and JavaScript to be loaded when viewing a world's login screen, allowing additional styling/functionality
```
