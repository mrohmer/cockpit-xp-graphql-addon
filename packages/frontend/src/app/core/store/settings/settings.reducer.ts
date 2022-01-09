import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
    restoreDefaults, setDarkMode,
    setWakeLock,
    setServerSettings,
    setServerSettingsHost,
    setServerSettingsPort,
} from '$core/store/settings/settings.action';
import { Settings } from '$core/models/settings';

export const initialState: Settings = {
  server: {
    host: 'localhost',
    port: 8080,
  },
  wakeLock: true,
  darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
};

const _settingsReducer = createReducer(
  initialState,
  on(
    setServerSettings,
    (state, {server}): Settings => ({
      ...state,
      server,
    })
  ),
  on(
    setServerSettingsHost,
    (state, {host}): Settings => ({
      ...state,
      server: {
        ...(state.server ?? {}),
        host,
      },
    })
  ),
  on(
    setServerSettingsPort,
    (state, {port}): Settings => ({
      ...state,
      server: {
        ...(state.server ?? {}),
        port,
      },
    })
  ),
  on(
    setWakeLock,
    (state, { wakeLock }): Settings => ({
      ...state,
      wakeLock,
    })
  ),
  on(
    setDarkMode,
    (state, { darkMode }): Settings => ({
      ...state,
      darkMode,
    })
  ),
  on(restoreDefaults, () => initialState)
);

export const settingsReducer: ActionReducer<Settings> = (state, action) => {
  return _settingsReducer(state, action);
};
