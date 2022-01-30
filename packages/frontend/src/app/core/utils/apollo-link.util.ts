import {buildServerUrl} from '$core/utils/server-url.util';
import {HttpLink} from 'apollo-angular/http';
import {State} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';

export const createApolloLink = (http: HttpLink, store: State<ApplicationState>) => http.create({
  uri: buildServerUrl(store.value.settings.server),
});
