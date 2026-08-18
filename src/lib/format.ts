import type { Lang } from '../i18n/strings';

export function fmtDate(iso: string, lang: Lang, precision = 'day'): string {
  if (!iso) return '';
  const d = new Date(iso.length === 4 ? `${iso}-01-01` : iso.length === 7 ? `${iso}-01` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const loc = lang === 'el' ? 'el-GR' : 'en-GB';
  if (precision === 'year' || iso.length === 4) return String(d.getFullYear());
  if (precision === 'month' || iso.length === 7) return new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric' }).format(d);
  return new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
