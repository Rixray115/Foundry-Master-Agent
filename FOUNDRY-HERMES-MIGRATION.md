# Foundry ↔ Hermes Agent Migration Plan

> Port the pi-foundry system from PI Agent to Hermes Agent
> (Nous Research Hermes Agent — open-source, self-hosted AI agent)

---

## 1. Architecture Overview

### Current (PI Agent)

```
┌──────────────────────┐     ┌──────────┐     ┌───────────────────────┐
│   PI Agent           │     │  Relay   │     │  FoundryVTT (browser) │
│                      │     │  :7401   │     │                       │
│  extension/index.ts  │────▶│ HTTP+WS  │────▶│  module/pi-bridge     │
│  (712 lines,         │◀────│ HMAC     │◀────│  v0.2.2 (GM client)  │
│   PI Extension API)  │     │  auth    │     │                       │
└──────────────────────┘     └────┬─────┘     └───────────────────────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │  RAG svc │
                            │  :7402   │
                            │ (15 docs │
                            │ indexed) │
                            └──────────┘
```

### Target (Hermes Agent)

```
┌──────────────────────┐     ┌──────────┐     ┌───────────────────────┐
│   Hermes Agent       │     │  Relay   │     │  FoundryVTT (browser) │
│                      │     │  :7401   │     │                       │
│  hermes-plugin/      │────▶│ HTTP+WS  │────▶│  module/pi-bridge     │
│  (new, ~500 lines,   │◀────│ HMAC     │◀────│  v0.2.2 (unchanged)  │
│   Hermes Plugin API) │     │  auth    │     │                       │
└──────────────────────┘     └────┬─────┘     └───────────────────────┘
                                  │
                                  ▼
                            ┌──────────┐
                            │  RAG svc │
                            │  :7402   │
                            │ (same)   │
                            └──────────┘
```

**Key insight:** The relay, bridge, and RAG are **agent-agnostic**. They speak HTTP+JSON+HMAC and don't care which agent calls them. Only the thin top layer changes.

---

## 2. What Stays Exactly the Same

| Component | Path | Changes needed |
|---|---|---|
| FoundryVTT bridge module | `module/` | **None** — runs in Foundry's browser |
| Relay server | `relay/` | **None** — HTTP+WS server |
| RAG service | `rag/` | **None** — embedding + search |
| Knowledge files | `knowledge/` | **None** — 15 curated `.md` files |
| Skill instructions | `skill/` | **None** — content reused as Hermes prompt |
| Auth secret | `.secret` | **None** — HMAC shared secret |
| Config example | `.env.example` | **None** — env vars stay the same |
| Gitignore | `.gitignore` | **None** |
| Graphify graph | `graphify-out/` | **None** — knowledge graph (optional) |

---

## 3. What Needs to Be Built

### 3.1 Hermes Plugin (`hermes-plugin/`)

A new directory with a Hermes-compatible plugin that wraps `sendCommand()`.

**Hermes plugin anatomy** (from Hermes docs):
- Hermes supports custom plugins that register tools
- Plugins can be written in Python or TypeScript
- Each tool has a name, description, parameters schema, and handler function

**Tools to register (4 total):**

| Tool Name | What it does | Maps to |
|---|---|---|
| `foundry_execute` | Sends a structured command to the relay | Same as PI's `foundry_execute` |
| `foundry_search_docs` | Semantic search over RAG | Same as PI's `foundry_search_docs` |
| `foundry_ping` | Tests connectivity | Same as PI's `foundry_ping` |
| `foundry_list_modules` | Lists active modules | Same as PI's `foundry_list_modules` |

**Core logic to port (from `extension/index.ts`):**
- `getSecret()` — reads `.secret` file or env var
- `sign()` — HMAC-SHA256 signing
- `sendCommand()` — HTTP POST to relay with signed payload
- Tool registrations — 4 wrappers around `sendCommand`

**Estimated lines:** ~500 lines (vs PI's 712 — Hermes may have simpler tool API)

### 3.2 System Prompt / Skill

The current `SKILL.md` contains:
- Boot Protocol (4 steps)
- Self-Healing Protocol (6 checks)
- Learning Protocol
- 10 Golden Rules
- Commands reference (21 commands)
- Modules reference (10 curated modules)
- Plutonium sources table

**Hermes adaptation:** Convert into Hermes' skill/memory format or inject as a system prompt. Hermes has a skill system that learns from experience — the curated knowledge could seed it.

### 3.3 RAG Integration

Hermes has persistent memory. The RAG could integrate in two ways:
1. **Light:** Hermes plugin calls `POST /search` on the RAG (port 7402) — same as PI does
2. **Deep:** Import the 15 curated knowledge docs into Hermes' own memory system

Option 1 is simpler and keeps the RAG as-is. Option 2 would need more work but would let Hermes search without a separate service.

---

## 4. Communication Flow (unchanged)

```
Hermes Plugin                Relay                      FoundryVTT
───────┬──────               ───┬──                      ────┬────
       │                        │                            │
       │  POST / { id,          │                            │
       │    command, args }     │  WS: { id, command,        │
       │  + HMAC signature      │    args }                  │
       ├───────────────────────▶├───────────────────────────▶│
       │                        │                            │
       │                        │                    Execute in GM context
       │                        │                    (Actor.createDocuments,
       │                        │                     Sequencer, Plutonium, etc.)
       │                        │                            │
       │                        │  WS: { id, result }        │
       │  200 { ok, data }      │◀───────────────────────────│
       │◀───────────────────────│                            │
       │                        │                            │
```

The relay queues the request, the bridge executes it when the GM WebSocket is available, and the response comes back asynchronously. This flow is identical regardless of which agent sends the request.

---

## 5. Hermes Plugin File Structure

```
pi-foundry/
├── hermes-plugin/              # NEW — Hermes-specific layer
│   ├── __init__.py             # Plugin entry point (Python)
│   ├── tools.py                # Tool definitions (4 tools)
│   ├── client.py               # sendCommand() + HMAC signing
│   └── README.md               # Install & usage instructions
│
├── module/                     # Unchanged — FoundryVTT bridge
├── relay/                      # Unchanged — WebSocket relay
├── rag/                        # Unchanged — RAG service
├── knowledge/                  # Unchanged — 15 curated docs
├── skill/                      # Unchanged — content reused
├── graphify-out/               # Unchanged — knowledge graph
│
├── .env.example                # Unchanged
├── .gitignore                  # Unchanged
├── .secret                     # Unchanged
└── FOUNDRY-HERMES-MIGRATION.md # This file
```

---

## 6. Implementation Steps (ordered)

### Phase 1: Foundation

| Step | What | Time |
|---|---|---|
| 1 | Create `hermes-plugin/` directory structure | 15 min |
| 2 | Port `sendCommand()` + HMAC signing from `extension/index.ts` | 30 min |
| 3 | Port `getSecret()` — read `.secret` or env var | 15 min |
| 4 | Register `foundry_ping` tool (simplest, no args) | 15 min |
| 5 | Verify Hermes can ping Foundry | 15 min |

### Phase 2: Core Tools

| Step | What | Time |
|---|---|---|
| 6 | Register `foundry_execute` tool with all 21 commands | 1 h |
| 7 | Register `foundry_list_modules` tool | 15 min |
| 8 | Register `foundry_search_docs` tool (RAG client) | 30 min |
| 9 | Test all 4 tools against live Foundry | 30 min |

### Phase 3: Instructions & Polish

| Step | What | Time |
|---|---|---|
| 10 | Convert SKILL.md → Hermes system prompt or skill | 1 h |
| 11 | Write `hermes-plugin/README.md` with install instructions | 30 min |
| 12 | Test full workflow: import → place → animate → clean | 30 min |
| 13 | Update `ARCHITECTURE.md` and `README.md` | 15 min |

**Total estimated time: ~5 hours**

---

## 7. Potential Issues

| Issue | Mitigation |
|---|---|
| Hermes Plugin API might not support Union types for command names | Use a single `command: string` param instead of 21 variants; validate server-side |
| Hermes runs in Python, PI extension is TypeScript | Rewrite the thin layer in Python — `sendCommand()` is just `requests.post()` |
| Hermes might not have a direct RAG equivalent | Keep the existing RAG service running; call it via HTTP from the plugin |
| HMAC secret management | Same `.secret` file works for both agents |
| Relay needs to be running before Hermes starts | Document the startup order in README |
| The `unsafe.eval` command is PI-specific | It's disabled by default; keep it in foundry_execute but document the risk |

---

## 8. Hermes Setup Requirements

- Python 3.10+ (Hermes requirement)
- `pip install hermes-agent` (or clone from [NousResearch/hermes-agent](https://github.com/nousresearch/hermes-agent))
- Hermes plugin directory pointed to `hermes-plugin/`
- Relay running on port 7401 (same as PI setup)
- RAG running on port 7402 (same as PI setup, optional)

---

## 9. Key Differences vs PI Agent

| Aspect | PI Agent | Hermes Agent |
|---|---|---|
| Language | TypeScript (extension) | Python (plugin) |
| Tool registration | `pi.registerTool({...})` | Plugin `@tool` decorator |
| Skill format | `SKILL.md` (static file) | System prompt or learned skills |
| Memory | RAG (separate service) | Built-in persistent memory |
| Knowledge graph | graphify-out | Could integrate with Hermes memory |
| `unsafe.eval` | Available (disabled by default) | N/A — don't implement |

---

## 10. Decision Points

Before starting, decide:

- **Python vs TypeScript plugin?** Hermes supports both. Python is more natural for Hermes.
- **RAG integration strategy:** Keep existing RAG service (option 1) or import into Hermes memory (option 2)?
- **Skill format:** Inject SKILL.md content as system prompt (simple) or create Hermes skills (more integrated)?
- **Maintenance:** Keep PI extension + Hermes plugin in sync, or deprecate PI once Hermes works?

---

_Generated: 2026-07-22_
