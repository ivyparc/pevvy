import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { AppText, Card, ListRow, type IconName } from '@/design/components';
import type { TranslationKey } from '@/core/i18n';
import { Screen } from '../shared/Screen';
import { PetSelector } from '../pets/PetSelector';
export const careAreas: readonly { key: TranslationKey; body: TranslationKey; icon: IconName }[] = [
  { key: 'daily', body: 'dailyBody', icon: 'sunny-outline' }, { key: 'health', body: 'healthBody', icon: 'heart-outline' },
  { key: 'activity', body: 'activityBody', icon: 'footsteps-outline' }, { key: 'grooming', body: 'groomingBody', icon: 'sparkles-outline' },
  { key: 'training', body: 'trainingBody', icon: 'ribbon-outline' }, { key: 'insights', body: 'insightsBody', icon: 'stats-chart-outline' },
];
export function CareScreen() {
  const { t } = useApp(); const router = useRouter();
  return <Screen title={t('careTitle')} subtitle={t('careBody')}><PetSelector /><Card>
    {careAreas.map(area => <ListRow key={area.key} title={t(area.key)} subtitle={t(area.body)} icon={area.icon} onPress={() => router.push({ pathname: '/(tabs)/care/[area]', params: { area: area.key } })} />)}
  </Card><AppText variant="caption" secondary>{t('featureBody')}</AppText></Screen>;
}
