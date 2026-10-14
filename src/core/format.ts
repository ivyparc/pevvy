import type { Language } from './settings';
export function locale(language: Language, region: string) { return `${language}-${region}`; }
export function formatDate(value: Date, language: Language, region: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale(language, region), { month: 'long', day: 'numeric', weekday: 'long', timeZone }).format(value);
}
export function formatMoney(amount: number, currency: string, language: Language, region: string) {
  return new Intl.NumberFormat(locale(language, region), { style: 'currency', currency }).format(amount);
}
export function formatMeasurement(value: number, kind: 'weight' | 'distance' | 'temperature', units: 'metric' | 'imperial', language: Language) {
  const imperial = units === 'imperial';
  const converted = kind === 'weight' ? (imperial ? value * 2.2046226218 : value)
    : kind === 'distance' ? (imperial ? value / 1.609344 : value) : (imperial ? value * 9 / 5 + 32 : value);
  const unit = kind === 'weight' ? (imperial ? 'lb' : 'kg') : kind === 'distance' ? (imperial ? 'mi' : 'km') : (imperial ? '°F' : '°C');
  return `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(converted)} ${unit}`;
}
