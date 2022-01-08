import { createAction, props } from '@ngrx/store';
import { Settings } from '$core/models/settings';

export const setWebsocketUrl = createAction(
  '[Settings] Set Websocket Url',
  props<Pick<Settings, 'websocketUrl'>>()
);
export const setWakeLock = createAction(
  '[Settings] Set Wake Lock',
  props<Pick<Settings, 'wakeLock'>>()
);
export const setDarkMode = createAction(
  '[Settings] Set Dark Mode',
  props<Pick<Settings, 'darkMode'>>()
);
export const restoreDefaults = createAction('[Settings] Restore Defaults');
