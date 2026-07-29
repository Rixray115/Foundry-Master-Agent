# Coven's Automation Toolkit (CAT) v0.0.6 — Kit de Automatización

## API

```js
cat   // global (window.cat) — API de automatización
// title, icon también se exponen como globales (side-effect)
// Clases: Automation, AuraTrigger, EffectTrigger, ItemTrigger, RegionTrigger,
//         RegisteredAutomations, RegisteredMacros, RegisteredAnimations, RegisteredScales,
//         CatRollResolver, EmbeddedMacros, MedkitApp, ...
```

## Hooks

- `catInit`, `catReady`, `libWrapper.Ready`
- `dnd5e.preRollAbilityCheck`, `dnd5e.preRollSavingThrow`, `dnd5e.preRollSkill`

## Uso

- Módulo API para automatizaciones basadas en Midi-QOL (extiende su workflow con timing de eventos precisos). No trae automatizaciones; va dirigido a autores de módulos y macro-writers. Utilidades para summons, diálogos, actores, ítems, macros embebidas y roll resolver manual.

## Dependencias

- `midi-qol` (requerido) + `dae`/DAE (requerido); integra con `dice-so-nice` y Visual Active Effects.
