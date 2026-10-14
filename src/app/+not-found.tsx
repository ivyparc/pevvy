import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { Card, StateView } from '@/design/components';
import { Screen } from '@/features/shared/Screen';
export default function NotFound() {
  const { t } = useApp(); const router = useRouter();
  return <Screen title={t('error')} back><Card><StateView state="error" action={{ label: t('home'), onPress: () => router.replace('/(tabs)/home') }} /></Card></Screen>;
}
