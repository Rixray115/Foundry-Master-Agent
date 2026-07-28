# PI-Foundry — Grafo de Arquitectura y Dependencias

Documento curado que describe el flujo **runtime** del sistema y las dependencias entre
sus cuatro componentes. Es la fuente de verdad para el grafo de conocimiento (graphify) y
se indexa en el RAG para que `foundry_search_docs` devuelva resultados conscientes de la
arquitectura (no solo por palabra clave).

## Componentes y puertos

- **PI Extension** (`extension/index.ts`): registra las tools `foundry_execute`,
  `foundry_ping`, `foundry_list_modules`, `foundry_search_docs`. Corre en Node, fuera de Foundry.
- **Relay** (`relay/server.mjs`): servidor local standalone en `127.0.0.1:7401` (HTTP + WebSocket).
  Puente entre la PI Extension y el módulo del GM. Autenticación HMAC-SHA256 (`verifySignature`).
- **PI Bridge Module** (`module/scripts/pi-bridge.mjs`): módulo de FoundryVTT que corre en el
  browser del GM. Expone `globalThis.piBridge`.
- **RAG Service** (`rag/server.mjs`): servidor de embeddings semánticos en `127.0.0.1:7402`
  (LanceDB + Transformers.js). Indexa la API de Foundry, módulos de terceros y `knowledge/*.md`.

## Flujo de comandos (Extension → Relay → Module → FoundryVTT)

1. `sendCommand()` (`extension/index.ts`) envía un POST HTTP a `RELAY_URL`
   (`http://127.0.0.1:7401/`) con firma HMAC (`sign()`).
2. `relay/server.mjs` verifica la firma (`verifySignature`), parsea el comando y lo reenvía al
   GM por WebSocket (`gmSocket.send`) en el path `/gm`.
3. El módulo recibe el comando en `module/scripts/pi-bridge.mjs`, que construye `BridgeClient`
   (`module/scripts/bridge-client.mjs`) y `CommandRouter` (`module/scripts/command-router.mjs`).
4. `BridgeClient` despacha el comando a `CommandRouter.execute()`, que valida contra `SCHEMAS`
   (`module/scripts/handlers/schemas.mjs`) y llama `handlers[command]`
   (`module/scripts/handlers/index.mjs`).
5. El handler se ejecuta en el contexto del GM (FoundryVTT) y devuelve el resultado, que vuelve
   por WS → Relay → respuesta HTTP a la Extension.

Dependencias del flujo (origen → destino), todas verificadas en el código fuente:
- `sendCommand()` (`extension/index.ts`) → Relay (`relay/server.mjs`)
- Relay (`relay/server.mjs`) → PI Bridge Module (`module/scripts/pi-bridge.mjs`)  [WebSocket `/gm`]
- PI Bridge Module (`module/scripts/pi-bridge.mjs`) → BridgeClient (`module/scripts/bridge-client.mjs`)
- BridgeClient (`module/scripts/bridge-client.mjs`) → CommandRouter (`module/scripts/command-router.mjs`)
- CommandRouter (`module/scripts/command-router.mjs`) → handlers (`module/scripts/handlers/index.mjs`)
- handlers (`module/scripts/handlers/index.mjs`) → FoundryVTT (contexto del GM)

## Flujo de RAG (búsqueda semántica)

- `foundry_search_docs` (registrada en `extension/index.ts` / `foundryExtension()`) hace `fetch`
  a `RAG_URL/search` (`http://127.0.0.1:7402/search`).
- El Relay también proxiea consultas RAG del módulo GM vía `/rag-proxy` → `rag/server.mjs`.

Dependencias:
- `foundryExtension()` (`extension/index.ts`) → RAG Service (`rag/server.mjs`)  [búsqueda]
- Relay (`relay/server.mjs`) → RAG Service (`rag/server.mjs`)  [proxy `/rag-proxy`]

## Cadena de dependencias entre módulos de FoundryVTT

Según `knowledge/module-inventory.md`:
- `midi-qol → dae → (times-up, active-auras)`
- `sequencer → (jb2a, autoanimations)`
- `autoanimations → sequencer, midi-qol`
- `chris-premades → midi-qol, dae, times-up`

## God nodes (abstracciones centrales)

- `dnd5e 5.3.3 Schema Gotchas` — verdades de schema verificadas de dnd5e 5.3.3.
- `BridgeClient` — único canal de comunicación GM↔Relay.
- `MidiQOL` — automatización de combate; gating de HP en `use()` scripted.
- `CommandRouter` — validación + dispatch tipado de todos los comandos.
- `Animation Wiring (dnd5e + Sequencer)` — patrón `postUseActivity` para animaciones JB2A.

## Conexiones sorpresa

- `MidiQOL` requiere el system `dnd5e` y recomienda `DAE`, `Times Up`, `Active Auras`.
- `Active Auras` recomienda `MidiQOL`.
- Los handlers `wire_animation` y `use_activity` encapsulan los gotchas G4/F1 para no
  re-descubrirlos cada sesión.
