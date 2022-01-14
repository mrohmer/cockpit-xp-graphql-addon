import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '$core/core.module';
import {Action, ActionReducer, State, Store, StoreModule} from '@ngrx/store';
import { settingsReducer } from '$core/store/settings/settings.reducer';
import {
  localStorageSync,
  rehydrateApplicationState,
} from 'ngrx-store-localstorage';
import { STORAGE } from '$core/models/storage';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApplicationState} from '$core/models/state';
import {createApolloLink} from '$core/utils/apollo-link.util';
import {InMemoryCache} from '@apollo/client/core';
import {HttpClientModule} from '@angular/common/http';

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
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CoreModule,
    HttpClientModule,
    StoreModule.forRoot(
      { settings: settingsReducer },
      {
        metaReducers: typeof window !== 'undefined' ? [localStorageSyncReducer] : [],
      }
    ),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink, store: State<ApplicationState>) {
        return {
          link: createApolloLink(httpLink, store),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink, State],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
