/**
 * Ingesta de Foundry V13 — parsea foundry.mjs (JSDoc) → chunks → embed → store
 */

import { readFile } from "node:fs/promises";
import { chunkSource, getFoundryVersion } from "../lib/chunker.mjs";
import { embedBatch, getEmbedDim } from "../lib/embed.mjs";
import { insertChunks, dropTable, count } from "../lib/store.mjs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const FOUNDRY_MJS = "C:/Program Files/Foundry Virtual Tabletop/resources/app/public/scripts/foundry.mjs";

const KNOWLEDGE_DIR = join(import.meta.dirname, "..", "..", "knowledge");

/**
 * Indexa los .md curados de knowledge/ en el RAG (vía el endpoint /index-document del
 * servidor RAG, que hace el embedding en el servidor). No requiere el modelo de embed local.
 * Se omite README.md. Idempotente: cada corrida re-indexa los documentos actuales.
 */
export async function ingestKnowledge() {
  console.log("[ingest] === Curated knowledge/*.md ===");
  let files = [];
  try {
    files = (await readdir(KNOWLEDGE_DIR)).filter((f) => f.endsWith(".md") && f !== "README.md");
  } catch {
    console.log("[ingest] knowledge/ no encontrado, se omite");
    return [];
  }
  const indexed = [];
  for (const f of files) {
    const text = await readFile(join(KNOWLEDGE_DIR, f), "utf8");
    const module = f.replace(/\.md$/, "");
    const title = (text.match(/^#\s+(.+)$/m)?.[1] || module).trim();
    try {
      const res = await fetch("http://127.0.0.1:7402/index-document", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text,
          metadata: {
            module,
            title,
            kind: "knowledge",
            symbol: module,
            parent: "knowledge",
            description: `Curated PI-Foundry knowledge: ${title}`,
            line: 0,
            source: "curated",
            foundry_version: "14.364",
          },
        }),
      });
      if (res.ok) { indexed.push(module); console.log(`[ingest] indexed ${module}`); }
      else console.log(`[ingest] FAILED ${module}: ${res.status}`);
    } catch (e) {
      console.log(`[ingest] ERROR ${module}: ${e.message}`);
    }
  }
  return indexed;
}

/**
 * Ingesta la API core de Foundry.
 */
export async function ingestFoundry() {
  console.log("[ingest] === Foundry Core API ===");
  console.log("[ingest] Leyendo foundry.mjs ...");

  const source = await readFile(FOUNDRY_MJS, "utf8");
  console.log(`[ingest] Source: ${(source.length / 1024 / 1024).toFixed(1)} MB`);

  const chunks = chunkSource(source, {
    module: "core",
    sourceFile: "foundry.mjs",
    filePath: "public/scripts/foundry.mjs",
  });

  console.log(`[ingest] Chunks extraídos: ${chunks.length}`);

  // Filtrar chunks con descripción sustancial (>= 10 chars)
  const meaningful = chunks.filter((c) => c.description && c.description.length >= 10);
  console.log(`[ingest] Chunks con descripción sustancial: ${meaningful.length}`);

  return meaningful;
}

/**
 * Ingesta un módulo de terceros (Sequencer, Tagger, MidiQOL, etc.)
 */
export async function ingestModule(moduleId) {
  const modulePath = `C:/Users/ricar/AppData/Local/FoundryVTT/Data/modules/${moduleId}`;
  console.log(`[ingest] === Módulo: ${moduleId} ===`);

  const { readdir, stat } = await import("node:fs/promises");
  const { join } = await import("node:path");

  // Encontrar archivos JS/MJS del módulo (Windows-compatible)
  let files = [];
  async function scanDir(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith("node_modules")) {
          await scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".mjs"))) {
          files.push(fullPath);
        }
      }
    } catch {
      // skip unreadable dirs
    }
  }
  await scanDir(modulePath);

  const allChunks = [];
  for (const file of files) {
    try {
      const source = await readFile(file, "utf8");
      const chunks = chunkSource(source, {
        module: moduleId,
        sourceFile: file.replace(modulePath + "/", ""),
        filePath: file,
      });
      const meaningful = chunks.filter((c) => c.description && c.description.length >= 10);
      allChunks.push(...meaningful);
    } catch {
      // skip binary/unreadable files
    }
  }

  console.log(`[ingest] ${moduleId}: ${allChunks.length} chunks`);
  return allChunks;
}

/**
 * Procesa chunks: genera embeddings y los inserta en LevelDB (vía store.insertChunks).
 */
async function processChunks(chunks, batchSize = 200) {
  const total = chunks.length;
  console.log(`[ingest] Procesando ${total} chunks en lotes de ${batchSize}...`);

  for (let i = 0; i < total; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.text);
    const vectors = await embedBatch(texts);

    const records = batch.map((c, j) => ({
      text: c.text,
      vector: vectors[j],
      symbol: c.symbol,
      kind: c.kind,
      parent: c.parent,
      description: c.description,
      line: c.line,
      source: c.source,
      foundry_version: c.foundry_version,
      module: c.module,
    }));

    await insertChunks(records);
    console.log(`[ingest] Progress: ${Math.min(i + batchSize, total)}/${total}`);
  }
}

/**
 * Pipeline completo de ingesta.
 */
export async function runIngest({ modules = ["sequencer", "tagger", "midi-qol"] } = {}) {
  console.log("[ingest] Iniciando ingesta...");
  await dropTable();

  // 1. Foundry core
  const foundryChunks = await ingestFoundry();

  // 2. Módulos de terceros
  const moduleChunks = [];
  for (const mod of modules) {
    const chunks = await ingestModule(mod);
    moduleChunks.push(...chunks);
  }

  // 3. Knowledge curado (knowledge/*.md) -> RAG
  const knowledgeModules = await ingestKnowledge();

  // 4. Combinar y procesar
  const allChunks = [...foundryChunks, ...moduleChunks];
  console.log(`[ingest] Total chunks a procesar: ${allChunks.length}`);

  await processChunks(allChunks);

  const total = await count();
  console.log(`[ingest] Ingesta completa. Total documentos en LevelDB: ${total}`);
  if (knowledgeModules.length) console.log(`[ingest] knowledge modules: ${knowledgeModules.join(", ")}`);

  // ⚠️ IMPORTANT: Restart the RAG server after re-ingest!
  // The in-memory vector cache (store.mjs) holds stale data until the process is killed.
  // Without restart, search() will query old cached vectors and report wrong counts.
  // Kill only the specific PID holding port 7402 (not all node.exe processes):
  //   netstat -ano | findstr :7402   → get PID
  //   taskkill //PID <pid>           → kill only that process
  console.log("[ingest] ⚠️ Restart the RAG server now to refresh the in-memory cache!");

  return total;
}
