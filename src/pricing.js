export const PRICING_DEFAULTS = {
  filamentPriceCentsPerKg: 2000,
  filamentDensityGCm3: 1.24,
  effectiveFillPercent: 25,
  printerPowerWatts: 150,
  energyPriceCentsPerKwh: 30,
  machineHourlyCostCents: 50,
  extrusionRateMm3PerSecond: 8,
  overheadMinutes: 15,
  markupPercent: 20,
  minQuoteCents: 500,
};

export function finalizeQuote({ grams, hours }, pricing = PRICING_DEFAULTS) {
  const materialCents = (grams / 1000) * pricing.filamentPriceCentsPerKg;
  const energyCents = hours * (pricing.printerPowerWatts / 1000) * pricing.energyPriceCentsPerKwh;
  const wearCents = hours * pricing.machineHourlyCostCents;
  const subtotalCents = materialCents + energyCents + wearCents;
  const withMarkupCents = subtotalCents * (1 + pricing.markupPercent / 100);
  const unitPriceCents = Math.max(pricing.minQuoteCents, Math.round(withMarkupCents));
  return {
    grams: Math.round(grams * 10) / 10,
    hours: Math.round(hours * 100) / 100,
    breakdown: {
      materialCents: Math.round(materialCents),
      energyCents: Math.round(energyCents),
      wearCents: Math.round(wearCents),
    },
    unitPriceCents,
  };
}

export function calculateQuote(volumeMm3, pricing = PRICING_DEFAULTS) {
  if (!Number.isFinite(volumeMm3) || volumeMm3 <= 0) {
    throw new TypeError("Il volume del modello deve essere un numero positivo.");
  }
  const effectiveMm3 = volumeMm3 * (pricing.effectiveFillPercent / 100);
  const grams = (effectiveMm3 / 1000) * pricing.filamentDensityGCm3;
  const hours =
    effectiveMm3 / (pricing.extrusionRateMm3PerSecond * 3600) +
    pricing.overheadMinutes / 60;
  return finalizeQuote({ grams, hours }, pricing);
}

const PRICING_SELECT = `
  SELECT
    price_filament_cents_per_kg AS filamentPriceCentsPerKg,
    price_filament_density_g_cm3 AS filamentDensityGCm3,
    price_effective_fill_percent AS effectiveFillPercent,
    price_printer_power_watts AS printerPowerWatts,
    price_energy_cents_per_kwh AS energyPriceCentsPerKwh,
    price_machine_hourly_cents AS machineHourlyCostCents,
    price_extrusion_mm3_per_second AS extrusionRateMm3PerSecond,
    price_overhead_minutes AS overheadMinutes,
    price_markup_percent AS markupPercent,
    price_min_quote_cents AS minQuoteCents
  FROM app_settings
  WHERE id = 1
`;

export function readPricingSettings(database) {
  const row = database.prepare(PRICING_SELECT).get();
  return row ?? { ...PRICING_DEFAULTS };
}

export function updatePricingSettings(database, pricing) {
  database.prepare(`
    UPDATE app_settings SET
      price_filament_cents_per_kg = @filamentPriceCentsPerKg,
      price_filament_density_g_cm3 = @filamentDensityGCm3,
      price_effective_fill_percent = @effectiveFillPercent,
      price_printer_power_watts = @printerPowerWatts,
      price_energy_cents_per_kwh = @energyPriceCentsPerKwh,
      price_machine_hourly_cents = @machineHourlyCostCents,
      price_extrusion_mm3_per_second = @extrusionRateMm3PerSecond,
      price_overhead_minutes = @overheadMinutes,
      price_markup_percent = @markupPercent,
      price_min_quote_cents = @minQuoteCents,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(pricing);
}
