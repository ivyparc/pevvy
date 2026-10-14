import { Redirect } from 'expo-router';
import { useApp } from '@/core/AppProvider';
export default function Index() {
  const { settings } = useApp();
  return <Redirect href={`/(tabs)/${settings.lastTab}`} />;
}
