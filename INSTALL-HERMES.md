# Installation Guide — Hermes Agent

> **Pi-foundry for Hermes Agent** — same relay/bridge/RAG infrastructure, different agent frontend.
>
> Ver [FOUNDRY-HERMES-MIGRATION.md](FOUNDRY-HERMES-MIGRATION.md) para el plan completo de portabilidad.

## Arquitectura

La infraestructura (relay, RAG, Foundry module) es **agent-agnostic** — habla HTTP+JSON+HMAC y no le importa qué agente la llama. Solo cambia la capa superior.

```
Hermes Agent              Relay (:7401)          FoundryVTT (browser)
──────┬──────             ───┬──                 ────┬────
      │                      │                       │
      │  POST / {command}    │  WebSocket             │
      │  + HMAC signature    ├──────────────────────▶ │ execute in GM context
      │─────────────────────▶│                       │
      │                      │◀──────────────────────│
      │◀─────────────────────│                       │
      │                      │                       │
      │                      │                       │
      │  POST /search        │                       │
      │─────────────────────▶│                       │
      │                      │                       │
      ▼                      ▼                       ▼
   hermes-plugin/         relay/                  module/
   (~300 lines Python)    (unchanged)             (unchanged)
```

## Prerrequisitos

Lo mismo que [INSTALL.md](INSTALL.md) más:

- Python 3.10+ (`python3 --version`)
- Hermes Agent instalado y funcionando
- `pip install requests` (para el plugin HTTP)

## Instalación

### Paso 1: Infraestructura compartida

Seguir [INSTALL.md](INSTALL.md) pasos 1–5 (clonar, secret, npm install, symlink, systemd).

**Resumen rápido:**
```bash
git clone https://github.com/Rixray115/Foundry-Master-Agent.git pi-foundry
cd pi-foundry
./scripts/generate-secret.sh
cd relay && npm install && cd ..
cd rag && npm install && cd ..
npm install
ln -s $(pwd)/module /var/foundryvtt/data/Data/modules/pi-bridge
# Configurar systemd igual que en INSTALL.md paso 5
```

### Paso 2: Hermes plugin

El plugin Hermes está en `hermes-plugin/`. Si el directorio no existe todavía (está en el roadmap), crea un plugin mínimo:

**`hermes-plugin/tools.py`** — plugin funcional mínimo:
```python
"""Hermes plugin for pi-foundry — registers 4 tools."""
import os
import hmac
import hashlib
import json
import requests
from pathlib import Path

RELAY_URL = os.environ.get("PI_FOUNDRY_RELAY_URL", "http://127.0.0.1:7401")
RAG_URL = os.environ.get("PI_FOUNDRY_RAG_URL", "http://127.0.0.1:7402")
SECRET_FILE = Path(__file__).parent.parent / ".secret"

def _get_secret() -> str:
    if secret := os.environ.get("PI_FOUNDRY_SECRET"):
        return secret
    if SECRET_FILE.exists():
        return SECRET_FILE.read_text().strip()
    raise RuntimeError(f"No secret found. Set PI_FOUNDRY_SECRET or create {SECRET_FILE}")

def _sign(body: str) -> str:
    return hmac.new(_get_secret().encode(), body.encode(), hashlib.sha256).hexdigest()

_counter = 0

def send_command(command: str, args: dict | None = None) -> dict:
    """Send a command to the Foundry relay and await the GM response."""
    global _counter
    import time
    _counter += 1
    payload = json.dumps({"id": f"hermes-{int(time.time()*1000)}-{_counter}", "command": command, "args": args or {}})
    resp = requests.post(f"{RELAY_URL}/", data=payload, headers={
        "content-type": "application/json",
        "x-pi-signature": _sign(payload),
    }, timeout=120)
    result = resp.json()
    if not result.get("ok"):
        raise RuntimeError(f"Command failed: {result.get('error', 'unknown')}")
    return result["data"]

# ─── Hermes tool registrations ───

def foundry_ping():
    """Test connectivity to FoundryVTT."""
    return send_command("ping")

def foundry_execute(command: str, args: dict | None = None):
    """Execute a structured command on FoundryVTT.

    Commands: ping, list_active_modules, create_actors, place_tokens,
    create_journal, run_macro, update_scene, execute_batch, add_items,
    plutonium_import, sync_modules, analyze_module, index_knowledge,
    play_animation, set_animation_effect, create_macro, create_region,
    wire_animation, verify_wiring, delete_entities, update_actors, unsafe.eval

    Always verify API shape with foundry_search_docs before calling.
    """
    return send_command(command, args)

def foundry_list_modules():
    """List active FoundryVTT modules and systems."""
    return send_command("list_active_modules")

def foundry_search_docs(query: str, module: str | None = None, limit: int = 5):
    """Semantic search over Foundry API docs and 64 curated module knowledge files."""
    resp = requests.post(f"{RAG_URL}/search", json={
        "query": query, "module": module, "limit": limit
    }, timeout=30)
    return resp.json()
```

**Registrar en Hermes:**

Dependiendo de la versión de Hermes, registra las tools como funciones decoradas o en el config del agente. Consulta la documentación de Hermes para el método exacto de registro de plugins.

### Paso 3: Configurar Foundry

1. Abre Foundry → **Manage Modules** → activa `pi-bridge` → F5
2. **Settings → PI Bridge** → pega `.secret` en "Shared Secret"
3. **Relay URL** = `ws://127.0.0.1:7401/gm`
4. Guarda y F5

### Paso 4: Arrancar servicios

```bash
# Relay + RAG (igual que PI)
sudo systemctl start pi-bridge-relay pi-rag
# O manualmente: cd relay && node server.mjs &
```

### Paso 5: Verificar

```python
from hermes_plugin.tools import foundry_ping, foundry_list_modules

foundry_ping()
# → {'pong': True, 'foundryVersion': '14.365', 'world': '...'}

foundry_list_modules()
# → {'modules': [...], 'hasSequencer': True, ...}
```

## Knowledge Graph (Graphify)

Igual que en PI — instalar y ejecutar:
```bash
uv tool install graphifyy
graphify update ~/pi-foundry
```

## RAG (búsqueda semántica)

El RAG corre como servicio separado (puerto 7402). 64 documentos curados + 54 análisis automáticos indexados.

```python
foundry_search_docs("create actor with system data", module="core")
foundry_search_docs("Sequencer animation API", module="sequencer")
```

## Homebrew / Monster Hunter

Mismo flujo que PI — descargar JSON, colocar en bestiary, importar con source `MHMM`:
```bash
curl -sL "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/collection/Amellwind%3B%20Monster%20Hunter%20Monster%20Manual.json" \
  -o "/path/to/foundrydata/Data/modules/plutonium/data/bestiary/bestiary-mhmm.json"
```

## Troubleshooting

### Hermes no reconoce el plugin
- Verifica que Hermes está configurado para buscar plugins en el directorio correcto
- Algunas versiones de Hermes requieren un `__init__.py` con metadata del plugin

### Error 401 (HMAC)
- El secret no coincide entre el plugin, relay y Foundry
- Verifica que `.secret` existe en la raíz del proyecto y tiene el mismo contenido en los tres lugares

### RAG search sin resultados
- El RAG no está corriendo o no tiene docs indexados
- Ejecuta `node scripts/analyze-modules.mjs --foundry-dir=/var/foundryvtt/data`

### Token art incorrecto
- Homebrew imports no incluyen imágenes
- Usa `Tokenizer2.tokenizeBatch(actors)` post-import
