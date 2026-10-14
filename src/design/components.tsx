import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View, type ColorValue, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/core/AppProvider';
import { minimumTouchTarget, radii, spacing, typography } from './tokens';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export function Icon({ name, size = 22, color }: { name: IconName; size?: number; color?: ColorValue }) {
  const { palette } = useApp();
  return <Ionicons name={name} size={size} color={color ?? palette.accent} accessible={false} />;
}
export function AppText({ children, variant = 'body', secondary = false, style, ...rest }: React.ComponentProps<typeof Text> & { variant?: keyof typeof typography; secondary?: boolean; style?: StyleProp<TextStyle> }) {
  const { palette } = useApp();
  return <Text {...rest} style={[typography[variant], { color: secondary ? palette.secondary : palette.text }, style]}>{children}</Text>;
}
export function Button({ label, onPress, variant = 'primary', disabled = false, icon }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; icon?: IconName }) {
  const { palette, isDark } = useApp();
  const foreground = variant === 'primary' ? (isDark ? palette.background : '#FFFFFF') : variant === 'danger' ? palette.danger : palette.accent;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} aria-disabled={disabled} disabled={disabled} onPress={onPress}
    style={({ pressed }) => ({ minHeight: minimumTouchTarget, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radii.md,
      backgroundColor: variant === 'primary' ? palette.accent : palette.soft, opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm })}>
    {icon && <Icon name={icon} color={foreground} />}<AppText variant="label" style={{ color: foreground, flexShrink: 1, textAlign: 'center' }}>{label}</AppText>
  </Pressable>;
}
export function IconButton({ name, label, onPress }: { name: IconName; label: string; onPress: () => void }) {
  const { palette } = useApp();
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={({ pressed }) => ({ minWidth: minimumTouchTarget, minHeight: minimumTouchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: palette.surface, opacity: pressed ? 0.6 : 1 })}><Icon name={name} /></Pressable>;
}
export function Card({ children, style, soft = false }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; soft?: boolean }) {
  const { palette } = useApp();
  return <View style={[{ padding: spacing.page, borderRadius: radii.lg, backgroundColor: soft ? palette.soft : palette.surface, gap: spacing.md }, style]}>{children}</View>;
}
export function Badge({ label }: { label: string }) {
  const { palette } = useApp();
  return <View style={{ alignSelf: 'flex-start', backgroundColor: palette.soft, borderRadius: radii.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md }}><AppText variant="caption" style={{ color: palette.accent }}>{label}</AppText></View>;
}
export function ListRow({ title, subtitle, icon, onPress, trailing }: { title: string; subtitle?: string; icon?: IconName; onPress?: () => void; trailing?: React.ReactNode }) {
  const { palette } = useApp();
  const content = <>
    {icon && <View style={{ padding: spacing.md, borderRadius: radii.md, backgroundColor: palette.soft }}><Icon name={icon} /></View>}
    <View style={{ flex: 1, gap: spacing.xs }}><AppText variant="label">{title}</AppText>{subtitle && <AppText variant="caption" secondary>{subtitle}</AppText>}</View>
    {trailing ?? (onPress && <Icon name="chevron-forward" size={18} color={palette.secondary} />)}
  </>;
  const style: ViewStyle = { minHeight: minimumTouchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md };
  return onPress ? <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title} style={({ pressed }) => [style, { opacity: pressed ? 0.6 : 1 }]}>{content}</Pressable> : <View style={style}>{content}</View>;
}
export function Input({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const { palette } = useApp();
  return <View style={{ gap: spacing.sm }}><AppText variant="label">{label}</AppText>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor={palette.secondary}
      style={[typography.body, { color: palette.text, minHeight: minimumTouchTarget, padding: spacing.md, backgroundColor: palette.surface, borderWidth: 1, borderColor: error ? palette.danger : palette.border, borderRadius: radii.md }, props.style]} />
    {error && <AppText variant="caption" accessibilityRole="alert" style={{ color: palette.danger }}>{error}</AppText>}
  </View>;
}
export function SegmentedControl<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  const { palette } = useApp();
  return <View accessibilityLabel={label} style={{ gap: spacing.sm }}>
    <AppText variant="label">{label}</AppText>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map(option => <Pressable key={option.value} onPress={() => onChange(option.value)} accessibilityRole="radio" accessibilityState={{ checked: value === option.value }} aria-checked={value === option.value} accessibilityLabel={option.label}
        style={{ minHeight: minimumTouchTarget, justifyContent: 'center', padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: value === option.value ? palette.accent : palette.border, backgroundColor: value === option.value ? palette.soft : palette.surface }}>
        <AppText variant="label" style={{ color: value === option.value ? palette.accent : palette.secondary }}>{option.label}</AppText>
      </Pressable>)}
    </View>
  </View>;
}
export type ScreenState = 'loading' | 'empty' | 'error' | 'offline' | 'denied';
export function StateView({ state, title, message, action }: { state: ScreenState; title?: string; message?: string; action?: { label: string; onPress: () => void } }) {
  const { t, palette } = useApp();
  const names: Record<ScreenState, IconName> = { loading: 'time-outline', empty: 'leaf-outline', error: 'alert-circle-outline', offline: 'cloud-offline-outline', denied: 'lock-closed-outline' };
  const body = { loading: 'loadingBody', empty: 'emptyBody', error: 'errorBody', offline: 'offlineBody', denied: 'deniedBody' } as const;
  return <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl }} accessibilityLiveRegion="polite">
    {state === 'loading' ? <ActivityIndicator accessibilityLabel={t('loading')} color={palette.accent} /> : <View style={{ backgroundColor: palette.soft, padding: spacing.lg, borderRadius: radii.pill }}><Icon name={names[state]} size={30} /></View>}
    <AppText variant="heading" style={{ textAlign: 'center' }}>{title ?? t(state)}</AppText>
    <AppText secondary style={{ textAlign: 'center' }}>{message ?? t(body[state])}</AppText>
    {action && <Button {...action} />}
  </View>;
}
export function BottomSheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const { palette, t } = useApp();
  const insets = useSafeAreaInsets();
  const closeRef = useRef<View>(null);
  useEffect(() => {
    if (visible && Platform.OS === 'web') {
      const previous = document.activeElement as HTMLElement | null;
      const timer = setTimeout(() => (closeRef.current as unknown as HTMLElement | null)?.focus?.(), 0);
      return () => { clearTimeout(timer); previous?.focus?.(); };
    }
  }, [visible]);
  return <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: palette.overlay }}>
      <Pressable accessibilityLabel={t('close')} accessibilityRole="button" onPress={onClose} style={{ flex: 1 }} />
      <View accessibilityViewIsModal style={{ width: '100%', maxWidth: 680, alignSelf: 'center', maxHeight: '88%', backgroundColor: palette.surface, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, paddingTop: spacing.lg, paddingBottom: Math.max(insets.bottom, spacing.page), paddingHorizontal: spacing.page }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.lg }}>
          <AppText variant="heading" accessibilityRole="header" style={{ flex: 1 }}>{title}</AppText>
          <Pressable ref={closeRef} onPress={onClose} accessibilityRole="button" accessibilityLabel={t('close')} style={{ minWidth: minimumTouchTarget, minHeight: minimumTouchTarget, justifyContent: 'center', alignItems: 'center' }}><Icon name="close" /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}>{children}</ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
export function ConfirmationDialog({ visible, title, message, confirmLabel, onConfirm, onClose }: { visible: boolean; title: string; message: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  const { t } = useApp();
  return <BottomSheet visible={visible} title={title} onClose={onClose}><AppText secondary>{message}</AppText><Button label={confirmLabel} variant="danger" onPress={onConfirm} /><Button label={t('cancel')} variant="secondary" onPress={onClose} /></BottomSheet>;
}
