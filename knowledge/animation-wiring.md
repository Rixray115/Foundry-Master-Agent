# Wiring JB2A animations to ability use (dnd5e 5.3.3 + Sequencer)

How to make a JB2A animation **actually play when an ability is used** in this stack.
This replaces the broken `activity.macroData.command` assumption (see `dnd5e-gotchas.md` G4).

## TL;DR
- `activity.macroData.command` is **not a real field** and never fires. Do not use it.
- The reliable mechanism is a single **`dnd5e.postUseActivity` hook** that maps the used
  item's name → a Sequencer animation spec + increments a counter.
- Items with **no activity** (passive feats) get a **persistent Sequencer effect** applied
  directly to the token instead.
- The Sequencer animation call is the **same API** the port's `play_animation` handler uses
  (verified `ok:true` standalone). `Sequence` is a global.

## Verified wiring pattern (what `pf_wire_anims` does)

```js
window.__lireaAnims = window.__lireaAnims || {};
window.__lireaWired = window.__lireaWired || {};

const LIREA_TOKEN = 'KuwP8kUFHJBmYfqD';
const ORC_TOKEN   = 'exTbJB95fDZoYEpB';

// Map by ITEM NAME -> animation spec.
const ANIM = {
  'Semblance — Azure Flame': { file:'modules/JB2A_DnD5e/Library/3rd_Level/Fireball/FireballLoop_01_Orange_800x800.webm', tint:'#ffcc66', scale:3, persist:true,  loc:'self',   key:'semblance' },
  'Staff of Azure Flame':   { file:'modules/JB2A_DnD5e/Library/2nd_Level/Divine_Smite/DivineSmite_01_Regular_BlueYellow_Target_400x400.webm', tint:'#66ccff', scale:1, persist:false, loc:'target', key:'staff-strike' },
  'Radiant Feint':          { file:'modules/JB2A_DnD5e/Library/3rd_Level/Fireball/FireballExplosion_01_Orange_800x800.webm', tint:'#66ccff', scale:3, persist:false, loc:'target', key:'radiant-feint' },
  'Healing Light':          { file:'modules/JB2A_DnD5e/Library/1st_Level/Cure_Wounds/CureWounds_01_Blue_400x400.webm', tint:null, scale:1, persist:false, loc:'target', key:'healing-light' },
  'Flame Guard':            { file:'modules/JB2A_DnD5e/Library/1st_Level/Shield/Shield_01_Regular_Blue_Complete_400x400.webm', tint:null, scale:1, persist:false, loc:'self',   key:'flame-guard' },
};

function locToken(spec) {
  if (spec.loc === 'self') return canvas.tokens.get(LIREA_TOKEN);
  const t = (game.user.targets && game.user.targets.size) ? game.user.targets.first() : null;
  return t || canvas.tokens.get(ORC_TOKEN);
}
function playLireaAnim(spec) {
  try {
    const tok = locToken(spec);
    if (!tok) return;
    let seq = new Sequence().effect().file(spec.file).atLocation(tok);
    if (spec.scale && spec.scale !== 1) seq = seq.scale(spec.scale);
    if (spec.tint) seq = seq.tint(spec.tint);
    if (spec.persist) seq = seq.persist(true, { name: 'lirea-' + spec.key });
    else seq = seq.belowTokens();
    seq.play();
    window.__lireaAnims[spec.key] = (window.__lireaAnims[spec.key] || 0) + 1;
  } catch (e) { console.error('lirea anim error', e); }
}

// Register ONCE (guarded against double-registration).
if (!window.__lireaWired.hook) {
  window.__lireaWired.hook = true;
  Hooks.on('dnd5e.postUseActivity', (activity, usageConfig, results) => {
    const name = activity && activity.item ? activity.item.name : null;
    const spec = ANIM[name];
    if (spec) playLireaAnim(spec);
  });
}

// Passive feat with NO activity -> persistent aura applied directly to the token.
if (!window.__lireaWired.mantle) {
  window.__lireaWired.mantle = true;
  const lt = canvas.tokens.get(LIREA_TOKEN);
  if (lt) {
    new Sequence().effect()
      .file('modules/JB2A_DnD5e/Library/3rd_Level/Fireball/FireballLoop_01_Orange_800x800.webm')
      .atLocation(lt).tint('#3399ff').scale(2)
      .persist(true, { name: 'lirea-azure-flame-mantle' }).play();
    window.__lireaAnims['azure-flame-mantle'] = (window.__lireaAnims['azure-flame-mantle'] || 0) + 1;
  }
}
```

## Verification (no visual needed)
- `window.__lireaWired.hook === true` → hook registered.
- `window.__lireaAnims[<key>]` increments each time the matching ability is used.
- For save-type abilities (e.g. Radiant Feint) a scripted `use()` is blocked (see
  `ability-use.md`); verify the wiring by directly invoking
  `Hooks.call('dnd5e.postUseActivity', { item:{ name:'Radiant Feint' } }, {}, {})` and checking
  the counter — this proves the map + play path without a real use.

## Recommended port handler: `wire_animation`
Wrap the above in a typed handler instead of hand-writing a macro each session:

```
wire_animation({ tokenId, itemName, file, tint?, scale?, persist?, loc:'self'|'target', counterKey })
```
- Idempotently ensures one `dnd5e.postUseActivity` hook (namespaced, e.g. `pi-bridge.anim`).
- For items with no activity: applies a persistent Sequencer effect to the token.
- Returns `{ hookRegistered, mapping, counters }`.
This removes the `macroData.command` anti-pattern from the agent's playbook entirely.
