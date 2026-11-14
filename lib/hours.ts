import type { DayHours } from '@/lib/site';

export type OpeningState = 'open' | 'closed' | 'unknown';

/** Senin = 0 ... Minggu = 6, supaya cocok dengan urutan `DayHours`. */
export function getTodayIndex(date: Date = new Date()) {
  return (date.getDay() + 6) % 7;
}

/** "16.00" / "24.00" -> menit sejak tengah malam. */
function toMinutes(value: string) {
  const [hours, minutes] = value.split('.').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Hitung status buka untuk satu outlet. Mendukung jam yang melewati tengah
 * malam (mis. 16.00 — 01.00) dan mengembalikan 'unknown' bila jam belum diisi.
 */
export function getOpeningState(
  hours: readonly DayHours[],
  date: Date = new Date(),
): OpeningState {
  const row = hours[getTodayIndex(date)];
  if (!row) return 'unknown';

  const opens = toMinutes(row.open);
  const closes = toMinutes(row.close);
  const current = date.getHours() * 60 + date.getMinutes();

  if (closes === opens) return 'unknown';
  const open = closes > opens ? current >= opens && current < closes : current >= opens || current < closes;

  return open ? 'open' : 'closed';
}
