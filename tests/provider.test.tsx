import React from 'react';
import { Text, Pressable } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/core/AppProvider';
import { defaultSettings, SETTINGS_KEY } from '../src/core/settings';

function Controls() {
  const { ready, settings, update, storageError, retrySave, reset, t } = useApp();
  return <>
    <Text>{ready ? 'ready' : 'loading'}</Text><Text>{JSON.stringify(settings)}</Text><Text>{storageError ? 'save failed' : 'saved'}</Text><Text>{t('home')}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Change" onPress={() => update({ language: 'ko', theme: 'dark', shippingCountry: 'US' })} />
    <Pressable accessibilityRole="button" accessibilityLabel="Retry" onPress={retrySave} />
    <Pressable accessibilityRole="button" accessibilityLabel="Reset" onPress={reset} />
  </>;
}
beforeEach(async () => { await AsyncStorage.clear(); jest.clearAllMocks(); });
it('hydrates, updates translations, persists, restores and resets preferences', async () => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...defaultSettings(), lastTab: 'shop' }));
  let view = render(<AppProvider><Controls /></AppProvider>);
  await screen.findByText('ready');
  fireEvent.press(screen.getByRole('button', { name: 'Change' }));
  expect(screen.getByText('홈')).toBeTruthy();
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem(SETTINGS_KEY))!)).toMatchObject({ theme: 'dark', language: 'ko', region: 'CA', shippingCountry: 'US', lastTab: 'shop' }));
  view.unmount(); view = render(<AppProvider><Controls /></AppProvider>);
  await screen.findByText('ready'); expect(screen.getByText('홈')).toBeTruthy();
  await act(async () => fireEvent.press(screen.getByRole('button', { name: 'Reset' })));
  expect(screen.getByText('Home')).toBeTruthy();
  expect(JSON.parse((await AsyncStorage.getItem(SETTINGS_KEY))!)).toMatchObject(defaultSettings());
  view.unmount();
});
it('reports storage errors and clears them after a successful retry', async () => {
  render(<AppProvider><Controls /></AppProvider>); await screen.findByText('ready');
  jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('Full disk'));
  fireEvent.press(screen.getByRole('button', { name: 'Change' })); await screen.findByText('save failed');
  fireEvent.press(screen.getByRole('button', { name: 'Retry' })); await screen.findByText('saved');
});
