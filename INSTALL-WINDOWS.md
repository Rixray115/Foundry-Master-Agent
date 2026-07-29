# Installation Guide — Windows 11

> **Nota**: Esta guía es para Windows 11. Para Linux, ver [INSTALL.md](INSTALL.md).

## Prerrequisitos

### 1. Node.js 20+

```powershell
winget install OpenJS.NodeJS.LTS
node --version   # v20+
npm --version
```

### 2. Git + Python

```powershell
winget install Git.Git
python --version  # 3.12+ (para graphify)
```

### 3. PI Agent

```powershell
npm install -g @earendil-works/pi-coding-agent
pi --version
dir %USERPROFILE%\.pi\agent\
```

### 4. FoundryVTT

| Componente | Versión requerida |
|---|---|
| FoundryVTT | **V14** (build 364+) |
| D&D 5e System | **5.3.3** |
| World | cualquiera creado |

### 5. Módulos recomendados

| Módulo | Versión |
|---|---|
| MidiQOL | 14.0.11 |
| Sequencer | 4.2.3 |
| JB2A DnD5e | 0.9.1 |
| DAE | 14.0.12 |
| Active Auras | 0.12.7 |
| Times Up | 13.1.9 |
| Plutonium | 2.16.2.v14 |
| Tagger | 1.6.0 |
| Automated Animations | 7.0.17 |
| Tokenizer 2 | 1.2.5 |
| DFreds Convenient Effects | 9.2.1 |
| Dice So Nice | 6.2.9 |

---

## Instalación

### Paso 1: Clonar

Abre **PowerShell** (no CMD):

```powershell
cd $HOME
git clone https://github.com/Rixray115/Foundry-Master-Agent.git pi-foundry
cd pi-foundry
```

### Paso 2: Generar secret HMAC

```powershell
$secret = -join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Maximum 256) })
$secret | Out-File -FilePath ".\.secret" -Encoding ascii -NoNewline
cat .\.secret
```

### Paso 3: Instalar dependencias

```powershell
cd relay; npm install; cd ..
cd rag; npm install; cd ..
npm install  # root (lmdb)
```

> `extension/` no necesita `npm install` — PI resuelve typebox desde su propia instalación.

### Paso 4: Symlinkar módulo en Foundry

Requiere **PowerShell como Administrador** o **Developer Mode** (Settings → Privacy → For developers → ON).

```powershell
$foundryModules = "$env:LOCALAPPDATA\FoundryVTT\Data\modules"
New-Item -ItemType SymbolicLink -Path "$foundryModules\pi-bridge" -Target "$HOME\pi-foundry\module"
```

> **Alternativa sin symlinks:** `Copy-Item -Path ".\module" -Destination "$foundryModules\pi-bridge" -Recurse` (repetir tras cada `git pull`)

### Paso 5: Configurar extensión PI

En `~\.pi\agent\settings.json`, añadir:
```json
"packages": ["C:\\Users\\<user>\\pi-foundry\\extension"]
```

O symlink (requiere Admin):
```powershell
New-Item -ItemType SymbolicLink -Path "$HOME\.pi\agent\extensions\pi-foundry" -Target "$HOME\pi-foundry\extension"
```

### Paso 6: Configurar el secret en Foundry

1. Abre Foundry → **Manage Modules** → activa `pi-bridge` → F5
2. **Settings → PI Bridge** → pega `.secret` en "Shared Secret"
3. **Relay URL** = `ws://127.0.0.1:7401/gm`
4. Guarda y F5

### Paso 7: Iniciar servicios

**Opción A — Terminales separadas:**

*Terminal 1 — Relay:*
```powershell
cd $HOME\pi-foundry\relay
$env:PI_BRIDGE_SECRET = Get-Content ..\.secret
node server.mjs
```

*Terminal 2 — RAG:*
```powershell
cd $HOME\pi-foundry\rag
node server.mjs
```

**Opción B — PM2 (recomendado):**
```powershell
npm install -g pm2
pm2 start "$HOME\pi-foundry\relay\server.mjs" --name pi-bridge-relay
pm2 start "$HOME\pi-foundry\rag\server.mjs" --name pi-rag
pm2 save; pm2 startup
```

### Paso 8: Analizar módulos

```powershell
cd $HOME\pi-foundry
node scripts\analyze-modules.mjs --foundry-dir="$env:LOCALAPPDATA\FoundryVTT" --output="knowledge\analyzed" --curated="knowledge"
```

### Paso 9: Graphify (opcional, knowledge graph)

```powershell
uv tool install graphifyy
graphify update .
```

---

## Post-instalación

1. Foundry abierto con `pi-bridge` activo
2. Relay + RAG corriendo (terminales o PM2)
3. PI reiniciado

Verifica:
```powershell
curl http://127.0.0.1:7401/health
curl http://127.0.0.1:7402/health
```

Prueba con PI:
```
foundry_ping
foundry_execute("plutonium_import", { creatures: [{ name: "Orc", source: "MM" }] })
```

---

## Troubleshooting

### Symlinks no funcionan
Activa Developer Mode o usa `Copy-Item` como alternativa.

### Error 401
El secret no coincide entre PI, relay y Foundry. Verifica los tres usen el mismo valor.

### RAG search sin resultados
Ejecuta el Paso 8 (analizar módulos).

### Plutonium no encuentra un source
Verifica que `bestiary-{source}.json` existe en `Data\modules\plutonium\data\bestiary\`. Para homebrew, descarga del repo `TheGiddyLimit/homebrew`.

### Token art incorrecto (mystery-man)
Homebrew imports no incluyen imágenes. Usa `Tokenizer2.tokenizeBatch(actors)` post-import.
