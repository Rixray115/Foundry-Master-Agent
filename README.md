# PI-Foundry: Agente IA para FoundryVTT V14

Arquitectura que permite a un agente de IA (PI) interactuar nativamente con FoundryVTT V14 para crear contenido on-the-fly: tokens, NPCs, macros, journal entries, animaciones, importación de monsters y más.

## ✨ Características

- 🎯 **Importación de monsters** desde 5etools via Plutonium (stats, acciones, traits, items, sprites) + homebrew (294 criaturas Monster Hunter)
- 🎬 **Animaciones** via Sequencer + JB2A (2104 animaciones profesionales) + Active Effects con toggle on/off
- ⚔️ **Automatización de combate** via MidiQOL + DAE + Times Up + Active Auras
- 🧠 **RAG local** sobre 64 documentos curados de módulos + API de Foundry (búsqueda semántica con embeddings locales)
- 📊 **Knowledge Graph** via Graphify — 45K+ nodos cubriendo 55 módulos instalados, con query/path/explain estructural
- 🔄 **Auto-aprendizaje**: el agente detecta módulos nuevos y aprende a usarlos automáticamente (Learning Protocol)
- 🔒 **Seguridad**: localhost binding, HMAC-SHA256 auth, comandos tipados, execFile sin shell injection

## 🚀 Quickstart

```bash
# 1. Clonar
git clone https://github.com/Rixray115/Foundry-Master-Agent.git pi-foundry
cd pi-foundry

# 2. Instalar dependencias
cd relay && npm install && cd ..
cd rag && npm install && cd ..
npm install

# 3. Generar secret y symlinkar módulo
./scripts/generate-secret.sh
ln -s $(pwd)/module /var/foundryvtt/data/Data/modules/pi-bridge

# 4. Configurar Graphify
uv tool install graphifyy
graphify update ~/pi-foundry

# 5. Configurar PI (en ~/.pi/agent/settings.json):
#    "packages": ["/home/user/pi-foundry/extension"]

# 6. Abrir Foundry → activar pi-bridge → configurar secret → F5

# 7. Probar:
#    foundry_ping
#    foundry_execute("plutonium_import", { creatures: [{ name: "Orc", source: "MM" }] })
```

> **Linux paths:** Foundry data puede estar en `/var/foundryvtt/data` (system install) o `~/foundryuserdata` (manual). Ajusta según tu instalación.

## 📋 Requisitos

### ⚠️ Prerrequisitos obligatorios

Estos componentes **deben estar instalados antes** de ejecutar el instalador:

#### 1. Agente IA — PI o Hermes

La infraestructura (relay, RAG, módulo Foundry) es **agent-agnostic** — funciona con ambos:

| Agente | Instalación | Guía |
|---|---|---|
| **PI Agent** | `npm install -g @earendil-works/pi-coding-agent` | [INSTALL.md](INSTALL.md) |
| **Hermes Agent** | Python 3.10+ + `hermes-plugin/` | [INSTALL-HERMES.md](INSTALL-HERMES.md) |

```bash
# PI Agent
npm install -g @earendil-works/pi-coding-agent
pi --version
ls ~/.pi/agent/

# Hermes Agent (alternativa)
pip install hermes-agent
# Configurar hermes-plugin/ según INSTALL-HERMES.md
```

El agente necesita un modelo LLM configurado. Ver `config/pi-settings.json.example` para PI, o la documentación de Hermes para configurar su modelo.

#### 2. FoundryVTT (obligatorio)

| Componente | Versión requerida | Notas |
|---|---|---|
| FoundryVTT | **V14** (build 364+) | Solo V14 soportado |
| D&D 5e System | **5.3.3** | Instalar desde Foundry's system installer |
| World | cualquiera creado | El agente opera sobre el world activo |

#### 3. Node.js + Python

```bash
node --version    # v20+ (usado por relay/rag)
python3 --version # 3.12+ (usado por graphify)
```

### Módulos de Foundry recomendados

Instala estos módulos para aprovechar el conocimiento curado completo (64 docs):

| Módulo | Versión | Función |
|---|---|---|
| MidiQOL | 14.0.11 | Automatización de combate |
| Sequencer | 4.2.3 | Framework de animaciones |
| JB2A DnD5e | 0.9.1 | 2104 animaciones .webm |
| DAE | 14.0.12 | Dynamic Active Effects |
| Active Auras | 0.12.7 | Efectos por proximidad |
| Times Up | 13.1.9 | Duración de efectos |
| Plutonium | 2.16.2.v14 | Import desde 5etools + homebrew |
| Tagger | 1.6.0 | Etiquetado de tokens |
| Automated Animations | 7.0.17 | Auto-play de animaciones |
| Tokenizer 2 | 1.2.5 | Generación de token art |
| DFreds Convenient Effects | 9.2.1 | 400+ efectos pre-built |
| Dice So Nice | 6.2.9 | Dados 3D |

> El agente funciona con cualquier subconjunto — los módulos faltantes se aprenden automáticamente via el Learning Protocol.

## 🏗️ Arquitectura

```
┌──────────┐    HTTP+HMAC    ┌──────────┐    WebSocket    ┌──────────────┐
│   PI     │ ──────────────→ │  Relay   │ ──────────────→ │  Foundry     │
│  Agent   │                 │ (Node)   │                 │  Module      │
│          │ ←────────────── │ :7401    │ ←────────────── │ (browser)    │
└──────────┘                 └──────────┘                 └──────────────┘
     │                                                          │
     │  HTTP                                                    │
     ▼                                                          ▼
┌──────────┐                                            ┌──────────────┐
│   RAG    │  Transformers.js + LevelDB (cosine)       │  FoundryVTT   │
│ Service  │  (embeddings locales, 384-dim)             │  Server       │
│ :7402    │                                            │  :30001       │
└──────────┘                                            └──────────────┘
```

Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalles.

## 📁 Estructura

```
pi-foundry/
├── relay/          # Bridge HTTP+WS (Node, puerto 7401)
├── module/         # Módulo FoundryVTT (browser-side, 22 handlers)
├── extension/      # Extensión PI (5 tools + foundry_query_graph)
├── rag/            # RAG service (embeddings locales + LevelDB, puerto 7402)
├── skill/          # PI skill (foundry, con Boot/Learning/Self-Healing Protocols)
├── knowledge/      # 64 documentos curados + 54 análisis automáticos
├── scripts/        # Instalación, análisis de módulos, build de grafo
├── config/         # Plantillas de configuración
└── .gitignore      # Excluye .env, .secret, graphify-out/, node_modules/
```

## 🧠 Knowledge Graph (Graphify)

El proyecto incluye un knowledge graph estructural de 45K+ nodos cubriendo los 55 módulos instalados + el código del proyecto + 64 docs de conocimiento:

```bash
# Construir/actualizar el grafo
graphify update ~/pi-foundry

# Queries estructurales
foundry_query_graph "What modules hook into renderCombatTracker?"
foundry_query_graph "How does Sequencer relate to JB2A?" --mode dfs

# Queries semánticas (RAG)
foundry_search_docs "create actor with system data" --module core
```

## 🏠 Homebrew / Fuentes adicionales

Plutonium soporta homebrew desde el repo `TheGiddyLimit/homebrew`. Ejemplo — Monster Hunter (294 criaturas):

```bash
curl -sL "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/collection/Amellwind%3B%20Monster%20Hunter%20Monster%20Manual.json" \
  -o "Data/modules/plutonium/data/bestiary/bestiary-mhmm.json"

# Luego importar con source "MHMM"
foundry_execute("plutonium_import", { creatures: [{ name: "Rathalos", source: "MHMM" }] })

# Generar tokens post-import (homebrew no incluye arte)
Tokenizer2.tokenizeBatch(actors)
```

## 🧠 Auto-aprendizaje de módulos

El agente puede aprender a usar módulos nuevos automáticamente:

1. `sync_modules` detecta módulos instalados que no están en el conocimiento curado
2. `analyze_module` extrae la API surface del módulo (globals, hooks, classes, methods)
3. El agente (LLM) sintetiza un archivo de conocimiento estructurado
4. `index_knowledge` persiste el conocimiento en el RAG para futuras sesiones

Esto funciona tanto al instalar como cuando el usuario añade módulos después.

## 📚 Documentación

- [INSTALL.md](INSTALL.md) — Guía detallada de instalación (Linux + systemd + Graphify)
- [INSTALL-WINDOWS.md](INSTALL-WINDOWS.md) — Guía de instalación para Windows 11
- [INSTALL-HERMES.md](INSTALL-HERMES.md) — Guía para Hermes Agent (infraestructura compartida)
- [ARCHITECTURE.md](ARCHITECTURE.md) — Diseño y componentes
- [CHANGELOG.md](CHANGELOG.md) — Historial de versiones (0.1.0 → 0.3.0)
- [knowledge/](knowledge/) — 64 documentos curados de módulos
- [knowledge/playbook.md](knowledge/playbook.md) — Recetario de 493 líneas con patrones verificados
- [knowledge/graphify-integration.md](knowledge/graphify-integration.md) — Arquitectura GraphRAG
- [FOUNDRY-HERMES-MIGRATION.md](FOUNDRY-HERMES-MIGRATION.md) — Plan de migración

## 📄 Licencia

MIT — ver [LICENSE](LICENSE)
