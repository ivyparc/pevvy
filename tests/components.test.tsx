import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Modal } from 'react-native';
import { AppProvider } from '../src/core/AppProvider';
import { Button, Input, SegmentedControl, StateView, BottomSheet, ConfirmationDialog } from '../src/design/components';
const wrapper = ({ children }: { children: React.ReactNode }) => <AppProvider>{children}</AppProvider>;
describe('shared accessible components', () => {
  it('exposes an enabled button and blocks disabled actions', async () => {
    const action = jest.fn();
    render(<><Button label="Continue" onPress={action} /><Button label="Unavailable" onPress={action} disabled /></>, { wrapper });
    await act(async () => {});
    fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.press(screen.getByRole('button', { name: 'Unavailable' }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  });
  it('labels input and communicates selection state', async () => {
    const change = jest.fn();
    render(<><Input label="Pet name" /><SegmentedControl label="Theme" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} value="dark" onChange={change} /></>, { wrapper });
    await act(async () => {});
    expect(screen.getByLabelText('Pet name')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Dark', checked: true })).toBeTruthy();
    fireEvent.press(screen.getByRole('radio', { name: 'Light' })); expect(change).toHaveBeenCalledWith('light');
  });
  it('provides a recovery action in an error state', async () => {
    const retry = jest.fn(); render(<StateView state="error" action={{ label: 'Try again', onPress: retry }} />, { wrapper });
    await act(async () => {});
    fireEvent.press(screen.getByRole('button', { name: 'Try again' })); expect(retry).toHaveBeenCalledTimes(1);
  });
  it('closes a sheet through Android back requests', async () => {
    const close = jest.fn(); render(<BottomSheet visible title="Example" onClose={close}><Input label="Pet name" /></BottomSheet>, { wrapper });
    await act(async () => {});
    const modal = screen.UNSAFE_getByType(Modal);
    fireEvent(modal, 'requestClose'); expect(close).toHaveBeenCalledTimes(1);
  });
  it('requires explicit confirmation', async () => {
    const confirm = jest.fn(); const close = jest.fn();
    render(<ConfirmationDialog visible title="Reset?" message="Reset preferences" confirmLabel="Reset" onConfirm={confirm} onClose={close} />, { wrapper });
    await act(async () => {});
    fireEvent.press(screen.getByRole('button', { name: 'Cancel' })); expect(close).toHaveBeenCalledTimes(1); expect(confirm).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('button', { name: 'Reset' })); expect(confirm).toHaveBeenCalledTimes(1);
  });
});
