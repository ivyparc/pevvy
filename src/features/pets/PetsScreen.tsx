import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { Badge, Button, Card, ListRow, StateView } from '@/design/components';
import { Screen } from '../shared/Screen';
export function PetsScreen() {
  const { t } = useApp(); const router = useRouter();
  return <Screen title={t('petsTitle')} subtitle={t('petsBody')}>
    <Card><StateView state="empty" title={t('noPets')} message={t('profilesSoon')} /><Badge label={t('nextPhase')} /></Card>
    <Card>{(['profiles', 'passport', 'documents', 'household'] as const).map(key => <ListRow key={key} title={t(key)} subtitle={t('availableLater')} icon={key === 'household' ? 'people-outline' : key === 'profiles' ? 'paw-outline' : 'document-text-outline'} />)}</Card>
    <Card soft><ListRow title={t('preferences')} subtitle={t('preferencesBody')} icon="options-outline" /><Button label={t('settings')} onPress={() => router.push('/settings')} /></Card>
  </Screen>;
}
