import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { countries } from '@/core/settings';
import type { TranslationKey } from '@/core/i18n';
import { AppText, Button, Card, ConfirmationDialog, ListRow, SegmentedControl } from '@/design/components';
import { spacing } from '@/design/tokens';
import { Screen } from '../shared/Screen';
export function countryLabel(country: string, t: (key: TranslationKey) => string) {
  return countries.includes(country as typeof countries[number]) ? t(`country_${country}` as TranslationKey) : country;
}
export function SettingsScreen() {
  const { t, settings, update, reset } = useApp(); const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const regionOptions = [...new Set<string>([...countries, settings.region, settings.shippingCountry])].map(value => ({ value, label: countryLabel(value, t) }));
  return <Screen title={t('settings')} subtitle={t('preferencesBody')} back>
    <Card>
      <SegmentedControl label={t('language')} options={[{ value: 'en', label: t('english') }, { value: 'ko', label: t('korean') }]} value={settings.language} onChange={language => update({ language })} />
      <SegmentedControl label={t('appearance')} options={(['system', 'light', 'dark'] as const).map(value => ({ value, label: t(value) }))} value={settings.theme} onChange={theme => update({ theme })} />
      <SegmentedControl label={t('units')} options={(['metric', 'imperial'] as const).map(value => ({ value, label: t(value) }))} value={settings.units} onChange={units => update({ units })} />
    </Card>
    <Card>
      <SegmentedControl label={t('region')} value={settings.region} options={regionOptions} onChange={region => update({ region })} />
      <AppText variant="caption" secondary>{t('regionHelp')}</AppText>
      <View style={{ height: spacing.sm }} />
      <SegmentedControl label={t('shippingCountry')} value={settings.shippingCountry} options={regionOptions} onChange={shippingCountry => update({ shippingCountry })} />
      <AppText variant="caption" secondary>{t('deliveryBody')}</AppText>
    </Card>
    <AppText variant="caption" secondary>{t('saved')}</AppText>
    <Card><ListRow title={t('gallery')} subtitle={t('galleryBody')} icon="color-palette-outline" onPress={() => router.push('/design-system')} /></Card>
    <Button label={t('reset')} variant="danger" onPress={() => setConfirm(true)} />
    <ConfirmationDialog visible={confirm} title={t('resetTitle')} message={t('resetBody')} confirmLabel={t('confirm')} onClose={() => setConfirm(false)} onConfirm={() => { reset(); setConfirm(false); }} />
  </Screen>;
}
