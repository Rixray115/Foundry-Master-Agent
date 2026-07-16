/**
 * Vector Store — LevelDB persistence + in-memory brute-force cosine similarity.
 *
 * Replaces LanceDB (corruption on Windows with heavy batch writes).
 * Corpus: ~9,500 chunks × 384 dims ≈ 14 MB vectors → trivial for in-memory search.
 *
 * Schema per record:
 *   text (string), vector (Float32Array), symbol, kind, parent,
 *   description, line, source, foundry_version, module
 */

import { ClassicLevel as Level } from "classic-level";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const DB_PATH = process.env.RAG_LEVELDB_PATH ?? join(import.meta.dirname, "..", "data", "vectors");
const TABLE_NAME = "foundry_docs";

// Ensure directory exists
if (!existsSync(DB_PATH)) {
  mkdirSync(DB_PATH, { recursive: true });
}

let db = null;
let vectorsCache = null; // Map<id, {text, vector, symbol, kind, parent, description, line, source, foundry_version, module}>
let nextId = 0;

// ⚠️ GOTCHA: The in-memory vectorsCache is populated once on first access via loadCache().
// After a re-ingest (dropTable + insertChunks), the LevelDB on disk has new data but the
// in-memory cache still holds stale references. If you re-run ingest without restarting
// the server, search() will query the old cached vectors and report wrong document counts.
// ALWAYS restart the RAG server after re-ingesting to force loadCache() to reload from disk.

/**
 * Open (or create) the LevelDB database.
 */
export async function getDB() {
  if (db) return db;
  db = new Level(DB_PATH);
  await db.open();
  console.log(`[rag] LevelDB abierto en ${DB_PATH}`);
  return db;
}

/**
 * Load all vectors from disk into memory cache.
 */
async function loadCache() {
  if (vectorsCache) return vectorsCache;
  const dbConn = await getDB();
  vectorsCache = new Map();
  nextId = 0;

  for await (const [key, value] of dbConn.iterator()) {
    const record = JSON.parse(value);
    // Reconstruct Float32Array from stored array
    record.vector = new Float32Array(record._vectorData);
    delete record._vectorData;
    vectorsCache.set(key, record);
    const id = parseInt(key, 10);
    if (id >= nextId) nextId = id + 1;
  }

  console.log(`[rag] Cache cargada: ${vectorsCache.size} vectores en memoria.`);
  return vectorsCache;
}

/**
 * Insert chunks with their embeddings.
 */
export async function insertChunks(records) {
  const dbConn = await getDB();
  const cache = await loadCache();

  for (const record of records) {
    const id = String(nextId++);
    // Store vector as plain array for JSON serialization
    record._vectorData = Array.from(record.vector);
    delete record.vector;

    await dbConn.put(id, JSON.stringify(record));
    cache.set(id, { ...record, vector: new Float32Array(record._vectorData) });
    delete record._vectorData; // restore for next iteration
  }

  console.log(`[rag] Insertados ${records.length} chunks.`);
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Semantic search via brute-force cosine similarity.
 * @param {number[]} queryVector - Query embedding (384-dim)
 * @param {object} filters - { foundry_version?, module?, limit? }
 * @returns {Array<{text, symbol, kind, parent, description, line, source, foundry_version, module, score}>}
 */
export async function search(queryVector, { foundry_version, module, limit = 5 } = {}) {
  const cache = await loadCache();

  if (cache.size === 0) throw new Error("Índice vacío. Ejecuta la ingesta primero.");

  const queryVec = Array.isArray(queryVector) ? new Float32Array(queryVector) : queryVector;

  // Build candidate list with scores
  const candidates = [];
  for (const [id, record] of cache) {
    // Apply filters
    if (foundry_version && record.foundry_version !== foundry_version) continue;
    if (module && record.module !== module) continue;

    const score = cosineSimilarity(queryVec, record.vector);
    candidates.push({ ...record, _id: id, score });
  }

  // Sort by descending similarity and take top-N
  candidates.sort((a, b) => b.score - a.score);
  const results = candidates.slice(0, limit).map(r => ({
    text: r.text,
    symbol: r.symbol,
    kind: r.kind,
    parent: r.parent,
    description: r.description,
    line: r.line,
    source: r.source,
    foundry_version: r.foundry_version,
    module: r.module,
    score: r.score,
  }));

  return results;
}

/**
 * Total document count.
 */
export async function count() {
  const cache = await loadCache();
  return cache.size;
}

/**
 * Drop table (clear DB and cache).
 */
export async function dropTable() {
  if (!db) {
    db = new Level(DB_PATH);
    await db.open();
  }
  await db.clear();
  vectorsCache = null;
  nextId = 0;
  console.log(`[rag] Tabla "${TABLE_NAME}" eliminada.`);
}

/**
 * Close database connection.
 */
export async function close() {
  if (db) {
    await db.close();
    db = null;
  }
  vectorsCache = null;
}
