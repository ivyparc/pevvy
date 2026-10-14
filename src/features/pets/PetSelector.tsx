import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/core/AppProvider';
import { AppText, BottomSheet, Button, Icon, ListRow } from '@/design/components';
import { radii, spacing, minimumTouchTarget } from '@/design/tokens';
import type { Pet } from '@/core/contracts';
export function PetSelector({ pets = [] }: { pets?: readonly Pet[] }) {
  const { settings, palette, t, update } = useApp();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const scope = settings.petScope;
  const selectedPet = scope.kind === 'pet' ? pets.find(pet => pet.id === scope.petId) : undefined;
  return <>
    <Pressable accessibilityRole="button" accessibilityLabel={`${t('choosePet')}: ${selectedPet?.name ?? t('allPets')}`} onPress={() => setOpen(true)}
      style={{ alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.sm, minHeight: minimumTouchTarget, paddingHorizontal: spacing.lg, alignItems: 'center', backgroundColor: palette.soft, borderRadius: radii.pill }}>
      <Icon name="paw-outline" size={18} /><AppText variant="label" style={{ color: palette.accent }}>{selectedPet?.name ?? t('allPets')}</AppText><Icon name="chevron-down" size={16} />
    </Pressable>
    <BottomSheet visible={open} title={t('choosePet')} onClose={() => setOpen(false)}>
      <ListRow title={t('allPets')} icon="paw-outline" onPress={() => { update({ petScope: { kind: 'all' } }); setOpen(false); }} trailing={scope.kind === 'all' ? <Icon name="checkmark" /> : <View />} />
      {pets.map(pet => <ListRow key={pet.id} title={pet.name} icon={pet.species === 'dog' ? 'paw-outline' : 'heart-outline'} onPress={() => { update({ petScope: { kind: 'pet', petId: pet.id } }); setOpen(false); }} trailing={selectedPet?.id === pet.id ? <Icon name="checkmark" /> : <View />} />)}
      {!pets.length && <><AppText secondary>{t('profilesSoon')}</AppText><Button variant="secondary" label={t('seePets')} onPress={() => { setOpen(false); router.push('/(tabs)/pets'); }} /></>}
    </BottomSheet>
  </>;
}
