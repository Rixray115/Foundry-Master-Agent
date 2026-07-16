# dnd5e 5.3.3 — Schema Gotchas (PI-Foundry)

Curated, battle-tested gotchas for driving the **dnd5e 5.3.3** system programmatically
(actor/items/activities creation + ability use) from the PI agent. Discovered during the
Lirea cleric V14 port stress-test. Every point below was verified against the live
`dnd5e.mjs` source and/or empirically.

> Versions: Foundry V14.364, system dnd5e 5.3.3, modules MidiQOL + Sequencer + JB2A + itemacro.
> Many of these are NOT bugs in the port — they are **fixed schema facts** of dnd5e 5.3.3
> that the port's handlers and agent prompts must respect.

## A. Schema facts (document, do not "fix")

- **G1 — Set-based fields serialize to `{}`.** `traits.dr.value`, `traits.dr.custom`,
  `traits.di.value`, `traits.ci.value`, `system.traits.*` are JS `Set`s.
  `JSON.stringify()` on them yields `{}` (false negative). Always verify via `Array.from(x)`,
  never `JSON.stringify`. Applies to resistances/immunities/condition immunities.
- **G2 — Skill proficiency is `skills.<id>.value` (0/1/2).** `0`=none, `1`=proficient,
  `2`=expertise. `skills.<id>.proficient` is a **computed-only** getter — writing it is
  silently ignored. Set `.value`.
- **G3 — Feat items have NO `system.recharge` field.** "Recharge 5-6" style mechanics are an
  *actor-level NPC* concept, not an Item schema field. It can only live in the item
  description text — there is no enforceable data field. Do not try to set it.
- **G4 — `activity.macroData` is NOT a field.** `BaseActivityData` schema (dnd5e.mjs ~L11825)
  has no `macro`/`macroData` property. Setting `activity.macroData.command` via
  `updateActivity` *persists as arbitrary data* (read-back looks fine) but is **never executed
  on `use()`**. The "On Use Macro" is supplied by: (a) the **itemacro** module
  (`item.flags.itemacro.macro`), or (b) **MidiQOL** (`item.flags['midi-qol'].onUseMacroName`).
  The native, reliable hook for "run code when an ability is used" is
  `Hooks.on('dnd5e.postUseActivity', (activity, usageConfig, results) => …)` — fires for every
  activity use, independent of MidiQOL.
- **G5 — Save DC formula gotcha.** `save.dc.calculation:"flat"` is treated as **truthy** by
  dnd5e's DC formula (dnd5e.mjs ~L31311) and routes to ability-based DC computation, **ignoring**
  `formula`. For a genuine fixed DC use `calculation:""` (empty string) + `formula:"<value>"`.
  Also `dc.bonus` is **force-reset to `""`** every `prepareData()` cycle — never store a
  persistent value there.
- **G6 — Weapons auto-generate a default attack activity.** If `system.damage.base` is set,
  item creation auto-adds one attack activity. If you then also `createActivity('attack', …)`
  you end up with **two** attack activities. Clean up by deleting all existing activities first,
  then creating exactly one.

## B. Port-handler behaviors to harden (these ARE fixable in handlers)

- **H1 — `createDocuments` silently drops items with inline `system.activities`.**
  `Actor.createDocuments` / `createEmbeddedDocuments` returns an **empty array** (no error) if
  `system.activities` is included inline in creation data. Activities must be added in a **second
  step** via `item.createActivity(type, data)` after the item exists.
- **H2 — `createActivity(type, data)` needs a real template clone.** The `data` object must be
  cloned from a **real existing activity template** (e.g. Goblin's Scimitar for `attack`,
  Goblin's Nimble Escape for `utility`, compendium `dnd5e.spells` → "Cure Wounds" for `heal`,
  "Fireball" for `save`). A partial hand-built object throws
  `Cannot read properties of undefined`.
- **H3 — `createActivity()` does NOT reliably apply nested fields** inside `attack`
  (bonus/ability/flat) or `save.dc` (calculation/bonus) from the initial data. Follow up with
  `item.updateActivity(actId, { attack:{…}, save:{ dc:{…} } })` for those to stick.
- **H4 — Spell `activation.type` is set on the ITEM, not the activity.** For spell items,
  `activation.type` does not take from `createActivity`/`updateActivity` on the activity directly
  — set it via the item's own `system.activation.type` (e.g. `hw.update({ system:{ activation:{ type:'bonus' } } })`),
  which then propagates to the activity.
- **H5 — `createActivity`/`updateActivity` arg shape.** Use
  `item.createActivity(type, data, {renderSheet:false})` and
  `item.updateActivity(activityId, updates)`. Verify signatures against dnd5e.mjs
  (`createActivity` ~L23790, `updateActivity` ~L23817).

## C. Ability-use friction (MidiQOL + dnd5e)

- **F1 — MidiQOL blocks scripted `activity.use()`.** MidiQOL defaults
  (`autoApplyDamage:"none"`, `autoRollDamage:"none"`, `autoCheckSaves:"none"`) mean a scripted
  `use()` either **hangs on an interactive workflow/save dialog** (relay must guard with a
  `Promise.race` timeout) or **completes without applying HP changes**. Temporarily flipping
  those settings to `yes`/`always`/`all` still did not apply HP via a scripted `use()` — MidiQOL's
  workflow is built around interactive UI flow, not programmatic `use()`. Mechanical HP
  verification is therefore **not achievable end-to-end through the relay**.
- **F2 — Save-type activities cannot be scripted at all.** `SaveActivity.use()` resolves the
  saving throw through a **separate `BasicRollDialog`** (not the `use()` dialog param). It blocks
  *before* `postUseActivity` fires, so any `postUseActivity` hook never runs for a save ability
  triggered by scripted `use()`. Attack/utility/heal types at least reach `postUseActivity`;
  heal reaches the hook then blocks on the apply-heal step.
- **F3 — Animation play call is reliable; HP application is not.** The Sequencer
  `new Sequence().effect().file(F).atLocation(tok).tint().scale().persist/belowTokens().play()`
  path (identical to the verified `play_animation` handler) executes fine and the
  `window.__lireaAnims[<key>]++` counter is the concrete proof the hook ran. Only the *mechanical*
  result is gated by MidiQOL.

## Quick reference — what to use instead

| Goal | Wrong (prior assumption) | Right (verified) |
|---|---|---|
| Wire animation on ability use | `item.updateActivity(id,{macroData:{command}})` | `Hooks.on('dnd5e.postUseActivity', …)` mapping item→Sequencer + counter |
| Fixed save DC | `save.dc.calculation:"flat"` + `formula` | `save.dc.calculation:""` + `formula` |
| Skill proficiency | `skills.<id>.proficient` | `skills.<id>.value` (0/1/2) |
| Add activities | inline in `createDocuments` | 2-step: create item → `createActivity` → `updateActivity` for nested fields |
| Read Set fields | `JSON.stringify` | `Array.from(x)` |
| Recharge on a feat | `system.recharge` | description text only (no field) |
