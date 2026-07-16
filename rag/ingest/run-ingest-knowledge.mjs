/**
 * Script standalone para indexar SOLO los .md curados de knowledge/ en el RAG.
 * No hace dropTable ni re-embeddea el código de módulos (ligero).
 * Uso: node ingest/run-ingest-knowledge.mjs
 */

import { ingestKnowledge } from "./ingest.mjs";

try {
  const indexed = await ingestKnowledge();
  console.log(`\n✅ Knowledge indexado: ${indexed.length} documentos -> ${indexed.join(", ")}`);
  process.exit(0);
} catch (err) {
  console.error("\n❌ Error indexando knowledge:", err);
  process.exit(1);
}
