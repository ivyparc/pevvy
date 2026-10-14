import { defaultSettings, parseSettings, SettingsRepository, SETTINGS_KEY } from '../src/core/settings';

describe('preferences storage', () => {
  const defaults = defaultSettings('ko', 'KR');
  it('recovers from corrupt, unknown-version, and missing preferences', () => {
    for (const raw of [null, 'broken', 'null', '{"version":2,"theme":"dark"}']) expect(parseSettings(raw, defaults)).toEqual(defaults);
  });
  it('validates each field independently', () => {
    const settings = parseSettings(JSON.stringify({ version: 1, theme: 'dark', language: 'xx', units: 'unknown', region: 'us', shippingCountry: 'US', lastTab: 'shop', petScope: { kind: 'pet', petId: '' } }), defaults);
    expect(settings).toMatchObject({ theme: 'dark', language: 'ko', units: 'metric', region: 'KR', shippingCountry: 'US', lastTab: 'shop', petScope: { kind: 'all' } });
  });
  it('restores persisted settings without coupling app region and delivery country', async () => {
    const store = new Map<string, string>();
    const repository = new SettingsRepository({ getItem: async key => store.get(key) ?? null, setItem: async (key, value) => { store.set(key, value); } });
    await repository.save({ ...defaults, theme: 'dark', shippingCountry: 'US', lastTab: 'care', petScope: { kind: 'pet', petId: 'dog-1' } });
    expect(await repository.load(defaultSettings())).toMatchObject({ language: 'ko', region: 'KR', shippingCountry: 'US', lastTab: 'care', petScope: { kind: 'pet', petId: 'dog-1' } });
  });
  it('serializes rapid writes so an older value cannot overwrite a later preference', async () => {
    let release!: () => void;
    const firstWrite = new Promise<void>(resolve => { release = resolve; });
    const stored: string[] = [];
    const repository = new SettingsRepository({ getItem: async () => null, setItem: async (key, value) => { expect(key).toBe(SETTINGS_KEY); if (!stored.length) await firstWrite; stored.push(value); } });
    const first = repository.save({ ...defaults, theme: 'light' });
    const last = repository.save({ ...defaults, theme: 'dark' });
    release(); await Promise.all([first, last]);
    expect(stored.map(raw => JSON.parse(raw).theme)).toEqual(['light', 'dark']);
  });
  it('allows retry after a storage failure', async () => {
    const write = jest.fn().mockRejectedValueOnce(new Error('Full disk')).mockResolvedValueOnce(undefined);
    const repository = new SettingsRepository({ getItem: async () => null, setItem: write });
    await expect(repository.save(defaults)).rejects.toThrow('Full disk');
    await expect(repository.save(defaults)).resolves.toBeUndefined();
  });
});
