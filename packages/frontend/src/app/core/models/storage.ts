import { Action } from '@ngrx/store';

export const STORAGE = '@ngrx/store/storage';

export class Storage implements Action {
  readonly type = STORAGE;
  constructor(readonly payload: string) {}
}
