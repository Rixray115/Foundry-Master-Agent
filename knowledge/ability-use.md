# Triggering ability use programmatically (dnd5e 5.3.3 + MidiQOL)

How to actually *use* an ability from the agent, and why it is more limited than it looks.
Companion to `animation-wiring.md` and `dnd5e-gotchas.md`.

## The call
```js
const act = actor.items.get(ITEM_ID).system.activities.get(ACTIVITY_ID);
await act.use({}, { configure: false });   // 2nd arg suppresses the ActivityUsageDialog
```
This fires `Hooks.call('dnd5e.postUseActivity', activity, usageConfig, results)` near the end
of `use()` — **that hook is the reliable place to run animation/counter logic**, independent of
MidiQOL.

## What works vs what blocks

| Activity type | Scripted `use()` outcome | Hook fires? | Notes |
|---|---|---|---|
| `attack` (weapon) | completes (`ok`) | ✅ (reaches `postUseActivity`) | no HP applied (MidiQOL-gated) |
| `utility` (bonus/reaction) | completes (`ok`) | ✅ | cleanest to script |
| `heal` | hook fires, then **timeout** on apply-heal | ✅ | heal not applied |
| `save` | **timeout** (save dialog blocks *before* hook) | ❌ | cannot be scripted (see below) |

## Friction 1 — MidiQOL owns HP application
MidiQOL's `autoApplyDamage` / `autoRollDamage` / `autoCheckSaves` default to `"none"`.
A scripted `use()` therefore either hangs on an interactive workflow/save dialog or completes
without applying damage/healing. Even temporarily setting them to `yes`/`always`/`all` did **not**
apply HP through a scripted `use()` — MidiQOL's workflow is built around interactive UI flow.
**Mechanical HP verification is not achievable end-to-end through the relay.** Guard every
`use()` with a `Promise.race([usePromise, timeout])` (≈15s) so the relay never hangs.

## Friction 2 — Save-type abilities cannot be scripted
`SaveActivity.use()` resolves the saving throw through a **separate `BasicRollDialog`** (not the
`use()` dialog param). It blocks *before* `postUseActivity` fires, so an animation hook never runs
for a save ability triggered by scripted `use()`. There is no clean `use()`-level flag to skip it.
- Workaround for **verifying wiring** of a save ability: invoke the registered hook directly,
  e.g. `Hooks.call('dnd5e.postUseActivity', { item:{ name:'Radiant Feint' } }, {}, {})`, and check
  the counter. This proves the map+play path without a real use.
- To truly use a save ability you need interactive GM confirmation (a human clicks the save) — by
  design.

## Recommended port handler: `use_activity`
Wrap triggering so the agent gets a structured result instead of a possible hang:
```
use_activity({ actorId, activityId, targetTokenId?, damageOrcFirst? })
  -> { completed:boolean, blocked:boolean, hpBefore, hpAfter, animCounter, useResult }
```
Implementation notes:
- Always run `use()` under a `Promise.race` timeout; report `blocked:true` instead of throwing.
- Do **not** rely on HP deltas for assertions when MidiQOL is active — report them as
  `gatedByMidiQOL`.
- For save-type abilities, expose a `verifyWiringOnly:true` mode that fires the hook directly.
- Optionally, for non-save abilities where HP application matters, the handler may temporarily
  set MidiQOL `autoApplyDamage/autoRollDamage/autoCheckSaves` to auto, run, then **restore** the
  original `ConfigSettings` in a `finally` block (proven safe: `csRestored:true`). Still does not
  guarantee HP application for scripted use, so treat HP as best-effort.

## Verification harness: `verify_wiring`
A single call that reads back `window.__lireaWired.hook` + `window.__lireaAnims` and returns status,
so future sessions confirm wiring in one shot instead of re-deriving it.
