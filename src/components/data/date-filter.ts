const DAY_MS = 86_400_000;

export function matchesDatePreset(dateLabel: string, preset: string, referenceDate = "2026-08-28") {
  if (preset === "All time") return true;
  const value = Date.parse(`${dateLabel} 12:00:00`);
  const reference = Date.parse(`${referenceDate}T12:00:00`);
  if (!Number.isFinite(value) || !Number.isFinite(reference)) return false;
  const difference = Math.floor((reference - value) / DAY_MS);
  if (preset === "Today") return difference === 0;
  if (preset === "Last 7 days") return difference >= 0 && difference < 7;
  if (preset === "Last 30 days") return difference >= 0 && difference < 30;
  if (preset === "Last 90 days") return difference >= 0 && difference < 90;
  if (preset === "This year") return new Date(value).getFullYear() === new Date(reference).getFullYear();
  return true;
}
