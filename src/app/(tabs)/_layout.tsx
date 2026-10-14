import { Tabs } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { Icon, type IconName } from '@/design/components';
import { tabs } from '@/core/settings';
const icons: Record<typeof tabs[number], [IconName, IconName]> = {
  home: ['home-outline', 'home'], care: ['heart-outline', 'heart'], explore: ['compass-outline', 'compass'],
  shop: ['bag-outline', 'bag'], pets: ['paw-outline', 'paw'],
};
export default function TabLayout() {
  const { palette, t } = useApp();
  return <Tabs initialRouteName="home" backBehavior="history" screenOptions={{ headerShown: false, tabBarActiveTintColor: palette.accent, tabBarInactiveTintColor: palette.secondary,
    tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border, minHeight: 64, paddingTop: 6 }, tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }, tabBarAllowFontScaling: true }}>
    {tabs.map(name => <Tabs.Screen key={name} name={name} options={{ title: t(name), tabBarAccessibilityLabel: t(name), tabBarIcon: ({ focused, color }) => <Icon name={icons[name][focused ? 1 : 0]} color={color} size={23} /> }} />)}
  </Tabs>;
}
