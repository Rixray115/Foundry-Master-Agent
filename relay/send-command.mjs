/**
 * Helper: envía un comando al relay PI Bridge vía HTTP con firma HMAC-SHA256.
 * Útil para comandos que no están en el enum del tool foundry_execute
 * (p.ej. handlers nuevos como create_macro / create_region).
 *
 * Uso:
 *   node relay/send-command.mjs <comando> '<json-args>'
 *   ej: node relay/send-command.mjs create_macro '{"macros":[{"name":"t","type":"chat","command":"x"}]}'  (type "script"/"chat" → numérico vía el handler)
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SECRET = (() => {
  if (process.env.PI_BRIDGE_SECRET) return process.env.PI_BRIDGE_SECRET;
  return readFileSync(join(import.meta.dirname, "..", ".secret"), "utf8").trim();
})();

const command = process.argv[2];
const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (!command) {
  console.error("Uso: node relay/send-command.mjs <comando> '<json-args>'");
  process.exit(1);
}

const body = JSON.stringify({ id: `cli-${Date.now()}`, command, args });
const sig = createHmac("sha256", SECRET).update(body).digest("hex");

const res = await fetch("http://127.0.0.1:7401/", {
  method: "POST",
  headers: { "content-type": "application/json", "x-pi-signature": sig },
  body,
});

const text = await res.text();
console.log(`HTTP ${res.status}`);
console.log(text);
try { console.log(JSON.stringify(JSON.parse(text), null, 2)); } catch {}
