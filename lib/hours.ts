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

function fromMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}`;
}

/**
 * Hitung status buka untuk satu outlet. Mendukung jam yang melewati tengah
 * malam (mis. 16.00 — 01.00) dan mengembalikan 'unknown' bila jam belum diisi.
 */
export function getOpeningState(
  hours: readonly DayHours[],
  date: Date = new Date(),
): OpeningState {
  const index = getTodayIndex(date);
  const row = hours[index];
  if (!row) return 'unknown';

  const opens = toMinutes(row.open);
  const closes = toMinutes(row.close);
  const current = date.getHours() * 60 + date.getMinutes();

  if (closes === opens) return 'unknown';
  if (isWithin(opens, closes, current)) return 'open';

  // Shift kemarin yang melewati tengah malam (mis. Sabtu 16.00 — 01.00)
  // masih berjalan sampai jam tutupnya, meskipun hari sudah berganti.
  const previous = hours[(index + 6) % 7];
  if (previous) {
    const previousOpen = toMinutes(previous.open);
    const previousClose = toMinutes(previous.close);
    if (previousClose < previousOpen && current < previousClose) return 'open';
  }

  return 'closed';
}

function isWithin(opens: number, closes: number, current: number) {
  return closes > opens
    ? current >= opens && current < closes
    : current >= opens || current < closes;
}

/**
 * Rentang layanan gabungan dari semua hari, mis. "15.00" — "24.00".
 * Dipakai untuk teks pengantaran di footer supaya tidak hardcode.
 */
export function getServiceWindow(hours: readonly DayHours[]) {
  if (!hours.length) return null;
  const opens = hours.map((row) => toMinutes(row.open));
  const closes = hours.map((row) => toMinutes(row.close));
  return {
    open: fromMinutes(Math.min(...opens)),
    close: fromMinutes(Math.max(...closes)),
  };
}
