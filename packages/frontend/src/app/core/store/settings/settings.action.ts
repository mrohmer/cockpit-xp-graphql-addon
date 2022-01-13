import { createAction, props } from '@ngrx/store';
import {ServerSettings, Settings} from '$core/models/settings';

export const setServerSettings = createAction(
  '[Settings] Set Server Settings',
  props<Pick<Settings, 'server'>>()
);
export const setServerSettingsHost = createAction(
  '[Settings] Set Server Host',
  props<Pick<ServerSettings, 'host'>>()
);
export const setServerSettingsPort = createAction(
  '[Settings] Set Server Port',
  props<Pick<ServerSettings, 'port'>>()
);
export const setWakeLock = createAction(
  '[Settings] Set Wake Lock',
  props<Pick<Settings, 'wakeLock'>>()
);
export const restoreDefaults = createAction('[Settings] Restore Defaults');
