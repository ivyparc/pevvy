import { useLocalSearchParams } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { Card, StateView } from '@/design/components';
import { careAreas } from '@/features/care/CareScreen';
import { Screen } from '@/features/shared/Screen';
export default function CareArea() {
  const { area } = useLocalSearchParams<{ area: string }>();
  const section = careAreas.find(item => item.key === area); const { t } = useApp();
  return <Screen title={section ? t(section.key) : t('care')} subtitle={section ? t(section.body) : undefined} back><Card><StateView state="empty" title={t('availableLater')} message={t('featureBody')} /></Card></Screen>;
}
