import assert from "node:assert/strict";
import { test } from "node:test";
import { parseGcodeStats } from "../src/slicer-quote.js";

test("legge grammi e tempo dal footer standard di PrusaSlicer", () => {
  const gcode = [
    "G1 X10 Y20 E0.5",
    "; total filament used [g] = 12.34",
    "; estimated printing time (normal mode) = 1h 30m 30s",
  ].join("\n");
  assert.deepEqual(parseGcodeStats(gcode), { grams: 12.34, seconds: 5430 });
});

test("usa il riepilogo per singolo estrusore quando manca il totale", () => {
  const gcode = "; filament used [g] = 3.5\n; estimated printing time (normal mode) = 45m 10s";
  assert.deepEqual(parseGcodeStats(gcode), { grams: 3.5, seconds: 2710 });
});

test("accetta la variante silent mode e i tempi in soli secondi", () => {
  const gcode = "; total filament used [g] = 0,8\n; estimated printing time (silent mode) = 95s";
  assert.deepEqual(parseGcodeStats(gcode), { grams: 0.8, seconds: 95 });
});

test("restituisce null se mancano le statistiche o sono invalide", () => {
  assert.equal(parseGcodeStats(""), null);
  assert.equal(parseGcodeStats("G1 X0 Y0"), null);
  assert.equal(parseGcodeStats("; total filament used [g] = 0"), null);
  assert.equal(parseGcodeStats("; total filament used [g] = 5\n; estimated printing time (normal mode) = soon"), null);
});
