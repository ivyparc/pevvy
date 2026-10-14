import React, { useEffect } from 'react';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme, useSegments, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { AppProvider, useApp } from '@/core/AppProvider';
import { tabs, type TabName } from '@/core/settings';
import { StateView } from '@/design/components';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
export const unstable_settings = { anchor: '(tabs)' };
function Navigation() {
  const { palette, ready, isDark, settings, update } = useApp();
  const segments: readonly string[] = useSegments();
  useEffect(() => { if (ready) void SplashScreen.hideAsync(); }, [ready]);
  const activeTab = segments[0] === '(tabs)' ? segments[1] as TabName : undefined;
  useEffect(() => {
    if (ready && activeTab && tabs.includes(activeTab) && activeTab !== settings.lastTab) update({ lastTab: activeTab });
  }, [activeTab, ready, settings.lastTab, update]);
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: palette.background }}><StateView state="loading" /></View>;
  const base = isDark ? DarkTheme : DefaultTheme;
  return <ThemeProvider value={{ ...base, colors: { ...base.colors, primary: palette.accent, background: palette.background, card: palette.surface, text: palette.text, border: palette.border } }}>
    <StatusBar style={isDark ? 'light' : 'dark'} />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background }, animation: 'none' }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="design-system" />
    </Stack>
  </ThemeProvider>;
}
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <SafeAreaProvider><AppProvider><View style={{ flex: 1, justifyContent: 'center', padding: 20 }}><Failure retry={retry} /></View></AppProvider></SafeAreaProvider>;
}
function Failure({ retry }: { retry: () => Promise<void> }) {
  const { t } = useApp(); return <StateView state="error" action={{ label: t('retry'), onPress: () => { void retry(); } }} />;
}
export default function RootLayout() {
  return <SafeAreaProvider><AppProvider><Navigation /></AppProvider></SafeAreaProvider>;
}
