import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const DEFAULT_TIMEOUT_MS = 120_000;
const GCODE_TAIL_BYTES = 512 * 1024;
const MAX_PROCESS_OUTPUT = 64 * 1024;

export class SlicerError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function parseDurationSeconds(value) {
  const hours = /(\d+(?:[.,]\d+)?)\s*h/.exec(value);
  const minutes = /(\d+(?:[.,]\d+)?)\s*m/.exec(value);
  const seconds = /(\d+(?:[.,]\d+)?)\s*s/.exec(value);
  if (!hours && !minutes && !seconds) return null;
  const parse = (match) => (match ? Number(match[1].replace(",", ".")) : 0);
  const total = parse(hours) * 3600 + parse(minutes) * 60 + parse(seconds);
  return total > 0 ? total : null;
}

export function parseGcodeStats(gcode) {
  if (typeof gcode !== "string" || gcode.length === 0) return null;
  const gramsMatch =
    /;\s*total filament used \[g\]\s*=\s*([0-9]+(?:[.,][0-9]+)?)/i.exec(gcode) ??
    /;\s*filament used \[g\]\s*=\s*([0-9]+(?:[.,][0-9]+)?)/i.exec(gcode);
  const timeMatch = /;\s*estimated printing time(?:\s*\((?:normal|silent) mode\))?\s*=\s*([^\r\n]+)/i.exec(gcode);
  const grams = gramsMatch ? Number(gramsMatch[1].replace(",", ".")) : null;
  const seconds = timeMatch ? parseDurationSeconds(timeMatch[1]) : null;
  if (!Number.isFinite(grams) || grams <= 0 || !Number.isFinite(seconds) || seconds <= 0) return null;
  return { grams, seconds };
}

export function createSlicerService({
  executablePath = process.env.PRUSASLICER_PATH,
  profilePath = process.env.PRUSASLICER_PROFILE,
  timeoutMs = Number(process.env.PRUSASLICER_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS),
  spawnImpl = spawn,
} = {}) {
  const configured = typeof executablePath === "string" && executablePath.trim().length > 0;

  async function slice(modelPath) {
    if (!configured) {
      throw new SlicerError(
        "SLICER_NOT_CONFIGURED",
        "PrusaSlicer non e configurato: imposta la variabile PRUSASLICER_PATH.",
        503,
      );
    }
    const workDirectory = await mkdtemp(path.join(tmpdir(), "pixel-print-lab-slice-"));
    const outputFile = path.join(workDirectory, "output.gcode");
    try {
      const args = ["--export-gcode", "--output", outputFile];
      if (profilePath) args.push("--load", profilePath);
      args.push(modelPath);

      await new Promise((resolve, reject) => {
        const child = spawnImpl(executablePath, args, { windowsHide: true });
        let stderr = "";
        const collectStderr = (chunk) => {
          if (stderr.length < MAX_PROCESS_OUTPUT) stderr += chunk.toString();
        };
        child.stdout?.on("data", () => {});
        child.stderr?.on("data", collectStderr);
        const timer = setTimeout(() => {
          child.kill("SIGKILL");
          reject(new SlicerError("SLICER_TIMEOUT", "Lo slicing ha superato il tempo massimo consentito.", 504));
        }, timeoutMs);
        child.once("error", (error) => {
          clearTimeout(timer);
          reject(
            error.code === "ENOENT"
              ? new SlicerError("SLICER_NOT_FOUND", "L'eseguibile di PrusaSlicer non esiste nel percorso configurato.", 503)
              : error,
          );
        });
        child.once("close", (code) => {
          clearTimeout(timer);
          if (code === 0) return resolve();
          const trimmed = stderr.trim();
          const detail = trimmed ? `: ${trimmed.slice(-500)}` : "";
          console.error(`PrusaSlicer error (exit ${code}):${detail}`);
          reject(new SlicerError(
            "SLICER_FAILED",
            `PrusaSlicer non e riuscito a processare il modello (codice ${code}).`,
            422,
          ));
        });
      });

      const stats = await readFile(outputFile);
      const tail = stats.subarray(Math.max(0, stats.length - GCODE_TAIL_BYTES)).toString("utf8");
      const parsed = parseGcodeStats(tail);
      if (!parsed) {
        throw new SlicerError("SLICER_STATS_MISSING", "Il G-code non contiene le statistiche di filamento e tempo.", 502);
      }
      return parsed;
    } finally {
      await rm(workDirectory, { recursive: true, force: true }).catch(() => {});
    }
  }

  return { configured, slice };
}
