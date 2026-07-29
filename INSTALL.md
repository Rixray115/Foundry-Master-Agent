# Installation Guide

## Prerrequisitos

### Sistema operativo
- Linux (Ubuntu 22.04+, Arch, o equivalente)
- Node.js 20+ (usado por relay/rag — `which node`)
- npm 10+
- OpenSSL (para generar secrets)
- Python 3.12+ con `graphifyy` instalado (`uv tool install graphifyy`)

### FoundryVTT
- Versión **V14** (build 364+) — solo V14 soportado
- D&D 5e system v5.3.3 instalado
- World creado y accesible

> **Linux paths:** Foundry puede estar en `/var/foundryvtt/data` (system install) o `~/foundryuserdata` (manual). Ajusta `--foundry-dir` según corresponda.

### PI Agent
- `@earendil-works/pi-coding-agent` instalado
- Directorio `~/.pi/agent/` existente
- Extensión `graphify-global.ts` configurada (para knowledge graph queries)

### Módulos recomendados
Instala estos módulos en Foundry antes de la instalación:

| Módulo | Versión | Función |
|---|---|---|
| MidiQOL | 14.0.11 | Automatización de combate |
| Sequencer | 4.2.3 | Framework de animaciones |
| JB2A DnD5e | 0.9.1 | 2104 animaciones .webm |
| DAE | 14.0.12 | Dynamic Active Effects |
| Active Auras | 0.12.7 | Efectos por proximidad |
| Times Up | 13.1.9 | Duración de efectos |
| Plutonium | 2.16.2.v14 | Import desde 5etools |
| Tagger | 1.6.0 | Etiquetado de tokens |
| Automated Animations | 7.0.17 | Auto-play de animaciones |
| Tokenizer 2 | 1.2.5 | Generación de token art |
| DFreds Convenient Effects | 9.2.1 | 400+ efectos pre-built |
| Dice So Nice | 6.2.9 | Dados 3D |
| Carousel Combat Tracker | 5.0.0 | Combat tracker visual |

## Instalación

### Opción A: Instalador automático

```bash
git clone https://github.com/Rixray115/Foundry-Master-Agent.git pi-foundry
cd pi-foundry
./scripts/install.sh --foundry-dir /var/foundryvtt/data --world my-world
```

### Opción B: Instalación manual

#### 1. Generar secret HMAC

El secret HMAC-SHA256 es la clave compartida que autentica toda comunicación entre PI, el relay y el módulo de Foundry. **Los tres componentes deben usar el mismo secret.**

```bash
./scripts/generate-secret.sh
# → Crea .secret con 32 bytes hex aleatorios (permisos 600)
```

**¿Cómo se usa el secret en cada componente?**

| Componente | Cómo lee el secret |
|---|---|
| **PI Extension** | Lee `<pi-foundry-dir>/.secret` automáticamente, o usa la env var `PI_FOUNDRY_SECRET` |
| **Relay** | Lee `<pi-foundry-dir>/.secret` al arrancar (systemd service) |
| **Foundry Module** | Se configura en Foundry → Settings → PI Bridge → "Shared Secret" |

#### 2. Instalar dependencias

```bash
cd relay && npm install && cd ..
cd rag && npm install && cd ..
npm install  # root (lmdb)
```

#### 3. Symlinkar módulo en Foundry

```bash
ln -s $(pwd)/module /path/to/foundrydata/Data/modules/pi-bridge
```

#### 4. Configurar extensión PI

En `~/.pi/agent/settings.json`, añadir:
```json
"packages": ["/home/user/pi-foundry/extension"]
```

#### 5. Configurar servicios systemd

Editar `relay/pi-bridge-relay.service` y `rag/pi-rag.service` — reemplazar todas las ocurrencias de `/root/pi-foundry` con la ruta real del proyecto:

```ini
WorkingDirectory=/home/user/pi-foundry/relay
Environment=PI_BRIDGE_SECRET_FILE=/home/user/pi-foundry/.secret
ExecStart=/usr/bin/node server.mjs
ReadWritePaths=/home/user/pi-foundry
```

Luego instalar:
```bash
sudo cp relay/pi-bridge-relay.service /etc/systemd/system/
sudo cp rag/pi-rag.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now pi-bridge-relay pi-rag
```

#### 6. Configurar Graphify (knowledge graph)

```bash
# Instalar graphify
uv tool install graphifyy

# Configurar Python path y API key
mkdir -p ~/.pi/graphify/corpus ~/.pi/graphify/graphify-out
uv tool dir  # copia la ruta
echo "<ruta>/graphifyy/bin/python" > ~/.pi/graphify/.graphify_python
echo "sk-your-deepseek-key" > ~/.pi/graphify/.deepseek_key
chmod 600 ~/.pi/graphify/.deepseek_key

# Crear registro de proyectos
echo '{"projects":[{"name":"pi-foundry","path":"'$HOME'/pi-foundry"}]}' \
  > ~/.pi/graphify/corpus/projects.json

# Construir grafo inicial
graphify update ~/pi-foundry
```

#### 7. Indexar knowledge en RAG

```bash
# Con el RAG service corriendo (puerto 7402):
for f in knowledge/*.md; do
  curl -s -X POST http://127.0.0.1:7402/index-document \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"$(cat $f | sed 's/"/\\"/g' | tr '\n' ' ')\",\"metadata\":{\"source\":\"$(basename $f .md)\",\"type\":\"knowledge\"}}"
done
```

#### 8. Analizar módulos

```bash
node scripts/analyze-modules.mjs --foundry-dir=/var/foundryvtt/data --output=./knowledge/analyzed --curated=./knowledge
```

### Homebrew / Fuentes adicionales

Plutonium puede importar homebrew desde `TheGiddyLimit/homebrew` en GitHub. Coloca los JSON en:

```
Data/modules/plutonium/data/bestiary/bestiary-{source}.json
```

**Ejemplo: Monster Hunter (Amellwind) — 294 criaturas:**

```bash
curl -sL "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/master/collection/Amellwind%3B%20Monster%20Hunter%20Monster%20Manual.json" \
  -o "/path/to/foundrydata/Data/modules/plutonium/data/bestiary/bestiary-mhmm.json"
```

Luego importar con `plutonium_import` usando source `MHMM`.

⚠️ **Homebrew NO incluye token art.** Después de importar, usar Tokenizer para generar tokens:

```js
const actors = ["Rathalos","Nergigante"].map(n => game.actors.getName(n)).filter(Boolean);
await Tokenizer2.tokenizeBatch(actors);
// Luego sincronizar tokens en canvas con prototypeToken.texture.src
```

## Post-instalación

1. Abre FoundryVTT en el navegador
2. Ve a **Manage Modules** → activa `pi-bridge`
3. Ve a **Settings → PI Bridge** → pega el `.secret` en "Shared Secret", configura Relay URL = `ws://127.0.0.1:7401/gm`
4. Recarga (F5)
5. Verifica:

```bash
# PI debe responder a:
foundry_ping
foundry_list_modules
foundry_execute("plutonium_import", { creatures: [{ name: "Orc", source: "MM" }] })
```

## Troubleshooting

### `foundry_ping` timeout
- **Causa**: No hay navegador conectado, o el módulo pi-bridge no está activo
- **Solución**: Abre Foundry, activa pi-bridge, configura el secret, recarga (F5)

### RAG search sin resultados
- **Causa**: El índice no está construido
- **Solución**: Ejecuta el paso 7 (indexar knowledge en RAG)

### Comandos devuelven resultados vacíos sin error
- **Causa**: systemData mal formado para el schema dnd5e V14
- **Solución**: Empieza con `systemData: {}` y añade campos de a uno. Ver `knowledge/dnd5e-gotchas.md`

### Plutonium no encuentra un source
- **Causa**: El bestiary JSON no existe en `Data/modules/plutonium/data/bestiary/`
- **Solución**: Verifica que `bestiary-{source}.json` existe. Para homebrew, descarga el JSON del repo `TheGiddyLimit/homebrew`

### HotReload no captura cambios en handlers
- **Causa**: Cambios en `module/scripts/handlers/*.mjs` no se reflejan hasta recargar Foundry
- **Solución**: Pide al usuario que recargue Foundry (F5)

### Token art incorrecto (mystery-man)
- **Causa**: Homebrew imports no incluyen imágenes; Plutonium usa CDN URLs que necesitan internet
- **Solución**: `Tokenizer2.tokenizeBatch(actors)` después de importar para generar tokens con frames
