export const colors = {
  light: { background: '#F8F9FA', surface: '#FFFFFF', text: '#1C1C1E', secondary: '#63636A', accent: '#356B55', brand: '#4E8B72', soft: '#EAF3EE', border: '#DFE5E1', danger: '#AF2424', warning: '#8B5500', overlay: 'rgba(0,0,0,0.4)' },
  dark: { background: '#111816', surface: '#1B2420', text: '#F2F5F3', secondary: '#ADB8B1', accent: '#9CD1B2', brand: '#9CD1B2', soft: '#263D31', border: '#3D5146', danger: '#FFAAA3', warning: '#F4C578', overlay: 'rgba(0,0,0,0.65)' },
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, page: 20, xl: 24, xxl: 32, hero: 48 } as const;
export const radii = { sm: 8, md: 16, lg: 24, pill: 999 } as const;
export const typography = {
  title: { fontSize: 34, lineHeight: 42, fontWeight: '700' as const, letterSpacing: -0.8 },
  heading: { fontSize: 22, lineHeight: 29, fontWeight: '600' as const, letterSpacing: -0.3 },
  body: { fontSize: 17, lineHeight: 25, fontWeight: '400' as const },
  label: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 19, fontWeight: '400' as const },
} as const;
export const motion = { quick: 160, standard: 240 } as const;
export const minimumTouchTarget = 48;
