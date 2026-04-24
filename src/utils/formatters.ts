import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DEFAULT_CURRENCY_SYMBOL } from './constants';

dayjs.extend(relativeTime);

export function formatCurrency(centavos: number, symbol: string = DEFAULT_CURRENCY_SYMBOL): string {
  const amount = centavos / 100;
  return `${symbol}${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function toCentavos(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCentavos(centavos: number): number {
  return centavos / 100;
}

export function formatDate(isoString: string, format: string = 'MMM D, YYYY'): string {
  return dayjs(isoString).format(format);
}

export function formatDateTime(isoString: string): string {
  return dayjs(isoString).format('MMM D, YYYY h:mm A');
}

export function formatTime(isoString: string): string {
  return dayjs(isoString).format('h:mm A');
}

export function formatRelativeDate(isoString: string): string {
  return dayjs(isoString).fromNow();
}

export function formatAge(birthday: string | null): string {
  if (!birthday) return 'Unknown age';

  const birth = dayjs(birthday);
  const now = dayjs();
  const years = now.diff(birth, 'year');
  const months = now.diff(birth, 'month') % 12;

  if (years === 0 && months === 0) {
    const days = now.diff(birth, 'day');
    return `${days} day${days !== 1 ? 's' : ''} old`;
  }

  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  }

  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''} old`;
  }

  return `${years} yr${years !== 1 ? 's' : ''} ${months} mo old`;
}

export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${weight.toFixed(1)} ${unit}`;
}

export function daysUntil(isoString: string): number {
  return dayjs(isoString).diff(dayjs(), 'day');
}

export function isToday(isoString: string): boolean {
  return dayjs(isoString).isSame(dayjs(), 'day');
}

export function isPast(isoString: string): boolean {
  return dayjs(isoString).isBefore(dayjs());
}

export function isFuture(isoString: string): boolean {
  return dayjs(isoString).isAfter(dayjs());
}

export function startOfDay(isoString?: string): string {
  return dayjs(isoString).startOf('day').toISOString();
}

export function endOfDay(isoString?: string): string {
  return dayjs(isoString).endOf('day').toISOString();
}
