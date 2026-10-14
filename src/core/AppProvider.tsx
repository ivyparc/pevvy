import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '@/design/tokens';
import { defaultSettings, SettingsRepository, type Settings } from './settings';
import { translate, type TranslationKey } from './i18n';

const repository = new SettingsRepository(AsyncStorage);
function deviceDefaults() {
  const first = getLocales()[0];
  return defaultSettings(first?.languageCode === 'ko' ? 'ko' : 'en', first?.regionCode ?? 'CA');
}
interface AppContextValue {
  settings: Settings; ready: boolean; storageError: boolean; isDark: boolean; palette: typeof colors.light | typeof colors.dark;
  update: (patch: Partial<Omit<Settings, 'version'>>) => void; reset: () => void; retrySave: () => void;
  t: (key: TranslationKey) => string;
}
const Context = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(deviceDefaults);
  const current = useRef(settings);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const system = useColorScheme();
  const saveGeneration = useRef(0);
  const persist = useCallback((value: Settings) => {
    const generation = ++saveGeneration.current;
    repository.save(value).then(() => {
      if (saveGeneration.current === generation) setStorageError(false);
    }).catch(() => {
      if (saveGeneration.current === generation) setStorageError(true);
    });
  }, []);
  useEffect(() => {
    let active = true;
    repository.load(current.current).then((loaded) => {
      if (!active) return;
      // No pet repository exists yet. A stale individual selection must not become a record target.
      current.current = { ...loaded, petScope: { kind: 'all' } };
      setSettings(current.current);
    }).catch(() => { if (active) setStorageError(true); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  const update = useCallback((patch: Partial<Omit<Settings, 'version'>>) => {
    current.current = { ...current.current, ...patch };
    setSettings(current.current);
    persist(current.current);
  }, [persist]);
  const reset = useCallback(() => {
    current.current = deviceDefaults(); setSettings(current.current); persist(current.current);
  }, [persist]);
  const retrySave = useCallback(() => persist(current.current), [persist]);
  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && system === 'dark');
  const t = useCallback((key: TranslationKey) => translate(settings.language, key), [settings.language]);
  return <Context.Provider value={{ settings, ready, storageError, isDark, palette: isDark ? colors.dark : colors.light, update, reset, retrySave, t }}>{children}</Context.Provider>;
}
export function useApp() { const value = useContext(Context); if (!value) throw new Error('AppProvider is required'); return value; }
