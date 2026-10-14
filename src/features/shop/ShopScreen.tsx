import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { AppText, Badge, Card, Button, Icon, StateView } from '@/design/components';
import { spacing } from '@/design/tokens';
import { countryLabel } from '../settings/SettingsScreen';
import { Screen } from '../shared/Screen';
import { PetSelector } from '../pets/PetSelector';
export function ShopScreen() {
  const { t, settings } = useApp(); const router = useRouter();
  return <Screen title={t('shopTitle')} subtitle={t('shopBody')}><PetSelector />
    <Card><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}><Icon name="globe-outline" /><View style={{ flex: 1 }}><AppText variant="caption" secondary>{t('delivery')}</AppText><AppText variant="label">{countryLabel(settings.shippingCountry, t)}</AppText></View></View><Button variant="secondary" label={t('changeCountry')} onPress={() => router.push('/settings')} /></Card>
    <Card soft><View style={{ alignItems: 'center', padding: spacing.xl }}><Icon name="bag-handle-outline" size={68} /></View><Badge label={t('availableLater')} /><StateView state="empty" title={t('shopPending')} message={t('shopPendingBody')} /></Card>
  </Screen>;
}
