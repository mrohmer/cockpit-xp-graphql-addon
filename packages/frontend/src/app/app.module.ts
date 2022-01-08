import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '$core/core.module';
import { Action, ActionReducer, State, StoreModule } from '@ngrx/store';
import { settingsReducer } from '$core/store/settings/settings.reducer';
import {
  localStorageSync,
  rehydrateApplicationState,
} from 'ngrx-store-localstorage';
import { STORAGE } from '$core/models/storage';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return (state: State<any>, action: any) => {
    const keys = ['settings'];

    if (action.type === STORAGE && keys.includes(action.payload)) {
      const rehydratedState = rehydrateApplicationState(
        [action.payload],
        localStorage,
        (k) => k,
        true
      );
      return { ...state, ...rehydratedState };
    }

    return localStorageSync({
      keys,
      rehydrate: true,
    })(reducer)(state, action);
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    StoreModule.forRoot(
      { settings: settingsReducer },
      {
        metaReducers: [localStorageSyncReducer],
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
