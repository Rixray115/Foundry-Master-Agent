import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Cross-platform default: write audit.jsonl next to this script.
// (The previous default `/root/pi-foundry/relay/audit.jsonl` only works on Linux;
//  on Windows Node resolves `/root/...` to `C:\root\...`, silently misrouting the log.)
const LOG_PATH =
  process.env.PI_BRIDGE_AUDIT_LOG || fileURLToPath(new URL("audit.jsonl", import.meta.url));

let initialized = false;

async function ensureDir() {
  if (!initialized) {
    await mkdir(dirname(LOG_PATH), { recursive: true });
    initialized = true;
  }
}

/**
 * Appends a JSONL audit entry. Never throws — logging is best-effort.
 * @param {object} entry
 */
export async function audit(entry) {
  try {
    await ensureDir();
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n";
    await appendFile(LOG_PATH, line, { flag: "a" });
  } catch {
    // best-effort; don't crash the relay on log failure
  }
}
