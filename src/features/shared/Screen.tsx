import React from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/core/AppProvider';
import { AppText, Card, Button, Icon, IconButton } from '@/design/components';
import { spacing } from '@/design/tokens';
export function Screen({ title, subtitle, children, back = false }: { title: string; subtitle?: string; children: React.ReactNode; back?: boolean }) {
  const { palette, t, storageError, retrySave } = useApp();
  const router = useRouter();
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: palette.background }}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.page, paddingBottom: spacing.hero, width: '100%', maxWidth: 720, alignSelf: 'center', gap: spacing.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {back ? <IconButton name="arrow-back" label={t('back')} onPress={() => router.canGoBack() ? router.back() : router.replace('/')} /> : <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><Icon name="paw" size={20} /><AppText variant="label" style={{ color: palette.accent, letterSpacing: 2 }}>PET</AppText></View>}
        {back ? <View /> : <IconButton name="options-outline" label={t('settings')} onPress={() => router.push('/settings')} />}
      </View>
      <View style={{ gap: spacing.sm }}><AppText accessibilityRole="header" variant="title">{title}</AppText>{subtitle && <AppText secondary>{subtitle}</AppText>}</View>
      {storageError && <Card><AppText accessibilityRole="alert">{t('storageError')}</AppText><Button variant="secondary" label={t('retry')} onPress={retrySave} /></Card>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}
