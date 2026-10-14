import { useState } from 'react';
import { useApp } from '@/core/AppProvider';
import { AppText, Badge, BottomSheet, Button, Card, ConfirmationDialog, Input, ListRow, SegmentedControl, StateView, type ScreenState } from '@/design/components';
import { Screen } from '../shared/Screen';
export function DesignSystemScreen() {
  const { t } = useApp();
  const [name, setName] = useState(''); const [sheet, setSheet] = useState(false); const [dialog, setDialog] = useState(false);
  const [state, setState] = useState<ScreenState>('empty');
  return <Screen title={t('gallery')} subtitle={t('galleryBody')} back>
    <Card><AppText variant="heading">{t('components')}</AppText><Badge label={t('sampleBadge')} />
      <Input label={t('sampleInput')} placeholder={t('samplePlaceholder')} value={name} onChangeText={setName} />
      <Button label={t('primaryButton')} onPress={() => setSheet(true)} />
      <Button label={t('secondaryButton')} variant="secondary" onPress={() => setSheet(true)} />
      <Button label={t('disabledButton')} disabled onPress={() => undefined} />
      <ListRow title={t('sheet')} icon="albums-outline" onPress={() => setSheet(true)} />
      <ListRow title={t('confirmDemo')} icon="alert-circle-outline" onPress={() => setDialog(true)} />
    </Card>
    <Card><AppText variant="heading">{t('states')}</AppText><SegmentedControl label={t('stateSelect')} value={state} onChange={setState} options={(['loading', 'empty', 'error', 'offline', 'denied'] as const).map(value => ({ value, label: t(value) }))} />
      <StateView state={state} action={state === 'error' || state === 'offline' ? { label: t('retry'), onPress: () => setState('empty') } : undefined} />
    </Card>
    <BottomSheet visible={sheet} title={t('sheetTitle')} onClose={() => setSheet(false)}><AppText secondary>{t('sheetBody')}</AppText><Input label={t('sampleInput')} value={name} onChangeText={setName} placeholder={t('samplePlaceholder')} /><Button label={t('close')} onPress={() => setSheet(false)} /></BottomSheet>
    <ConfirmationDialog visible={dialog} title={t('demoTitle')} message={t('demoBody')} confirmLabel={t('demoConfirm')} onClose={() => setDialog(false)} onConfirm={() => { setName(''); setDialog(false); }} />
  </Screen>;
}
