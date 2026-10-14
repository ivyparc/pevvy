import type { PetScope } from './contracts';

export type Language = 'en' | 'ko';
export type TabName = 'home' | 'care' | 'explore' | 'shop' | 'pets';
export interface Settings {
  version: 1; language: Language; theme: 'system' | 'light' | 'dark';
  units: 'metric' | 'imperial'; region: string; shippingCountry: string;
  petScope: PetScope; lastTab: TabName;
}
export const tabs: readonly TabName[] = ['home', 'care', 'explore', 'shop', 'pets'];
export const countries = ['CA', 'US', 'KR', 'GB', 'FR', 'ES'] as const;
export function defaultSettings(language: Language = 'en', region = 'CA'): Settings {
  return { version: 1, language, theme: 'system', units: 'metric', region, shippingCountry: region, petScope: { kind: 'all' }, lastTab: 'home' };
}
export function parseSettings(raw: string | null, fallback: Settings): Settings {
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return fallback;
    const scope = data.petScope?.kind === 'pet' && typeof data.petScope.petId === 'string' && data.petScope.petId.trim()
      ? { kind: 'pet' as const, petId: data.petScope.petId } : { kind: 'all' as const };
    return {
      ...fallback,
      language: ['en', 'ko'].includes(data.language) ? data.language : fallback.language,
      theme: ['system', 'light', 'dark'].includes(data.theme) ? data.theme : fallback.theme,
      units: ['metric', 'imperial'].includes(data.units) ? data.units : fallback.units,
      region: typeof data.region === 'string' && /^[A-Z]{2}$/.test(data.region) ? data.region : fallback.region,
      shippingCountry: typeof data.shippingCountry === 'string' && /^[A-Z]{2}$/.test(data.shippingCountry) ? data.shippingCountry : fallback.shippingCountry,
      lastTab: tabs.includes(data.lastTab) ? data.lastTab : 'home', petScope: scope,
    };
  } catch { return fallback; }
}
export interface SettingsStorage { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }
export const SETTINGS_KEY = 'pet:preferences:v1'; // Never store auth tokens or pet records here.
export class SettingsRepository {
  private writes: Promise<void> = Promise.resolve();
  constructor(private storage: SettingsStorage) {}
  async load(fallback: Settings): Promise<Settings> { return parseSettings(await this.storage.getItem(SETTINGS_KEY), fallback); }
  save(settings: Settings): Promise<void> {
    const next = this.writes.catch(() => undefined).then(() => this.storage.setItem(SETTINGS_KEY, JSON.stringify(settings)));
    this.writes = next;
    return next;
  }
}
