import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { formatDate } from '@/core/format';
import { AppText, Badge, BottomSheet, Button, Card, Icon, StateView, type IconName } from '@/design/components';
import { spacing } from '@/design/tokens';
import { Screen } from '../shared/Screen';
import { PetSelector } from '../pets/PetSelector';
const quickActions = [['meal', 'restaurant-outline'], ['water', 'water-outline'], ['walk', 'footsteps-outline'], ['toilet', 'leaf-outline']] as const;
export function HomeScreen() {
  const { settings, t, palette } = useApp();
  const [sheet, setSheet] = useState(false);
  const router = useRouter();
  return <Screen title={t('todayBody')} subtitle={formatDate(new Date(), settings.language, settings.region)}>
    <PetSelector />
    <Card soft><Badge label={t('today')} /><AppText variant="heading">{t('dailyOverview')}</AppText><AppText secondary>{t('overviewBody')}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}><Icon name="paw" size={36} /><AppText secondary style={{ flex: 1 }}>{t('noPetsBody')}</AppText></View>
      <Button label={t('seePets')} onPress={() => router.push('/(tabs)/pets')} />
    </Card>
    <View style={{ gap: spacing.md }}><AppText variant="heading">{t('nextUp')}</AppText><Card><StateView state="empty" title={t('noSchedules')} message={t('noSchedulesBody')} /></Card></View>
    <View style={{ gap: spacing.md }}><AppText variant="heading">{t('quickLog')}</AppText><AppText secondary>{t('quickLogBody')}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{quickActions.map(([key, icon]) => <View key={key} style={{ flexGrow: 1, flexBasis: '44%' }}><Button variant="secondary" label={t(key)} icon={icon as IconName} onPress={() => setSheet(true)} /></View>)}</View>
    </View>
    <AppText variant="caption" secondary style={{ color: palette.secondary }}>{t('foundationBody')}</AppText>
    <BottomSheet visible={sheet} title={t('logTitle')} onClose={() => setSheet(false)}><AppText secondary>{t('logBody')}</AppText><Button label={t('seePets')} onPress={() => { setSheet(false); router.push('/(tabs)/pets'); }} /></BottomSheet>
  </Screen>;
}
