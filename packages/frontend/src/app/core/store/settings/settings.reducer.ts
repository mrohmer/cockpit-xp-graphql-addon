import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
    restoreDefaults, setDarkMode,
    setWakeLock,
    setWebsocketUrl,
} from '$core/store/settings/settings.action';
import { Settings } from '$core/models/settings';

export const initialState: Settings = {
  websocketUrl: undefined,
  wakeLock: true,
  darkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
};

const _settingsReducer = createReducer(
  initialState,
  on(
    setWebsocketUrl,
    (state, { websocketUrl }): Settings => ({
      ...state,
      websocketUrl,
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
