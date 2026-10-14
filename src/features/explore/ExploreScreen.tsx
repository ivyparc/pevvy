import { View } from 'react-native';
import { useApp } from '@/core/AppProvider';
import { AppText, Badge, Card, Icon, StateView } from '@/design/components';
import { spacing } from '@/design/tokens';
import { Screen } from '../shared/Screen';
export function ExploreScreen() {
  const { t } = useApp();
  return <Screen title={t('exploreTitle')} subtitle={t('exploreBody')}>
    <Card soft><View style={{ padding: spacing.xl, alignItems: 'center' }}><Icon name="compass-outline" size={76} /></View><Badge label={t('availableLater')} />
      <StateView state="empty" title={t('explorePending')} message={t('explorePendingBody')} />
    </Card>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>{(['outdoor', 'medical', 'services', 'petFriendly'] as const).map(key => <Badge key={key} label={t(key)} />)}</View>
    <AppText variant="caption" secondary>{t('foundationBody')}</AppText>
  </Screen>;
}
