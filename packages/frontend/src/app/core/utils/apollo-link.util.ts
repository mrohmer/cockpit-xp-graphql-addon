import {buildServerUrl} from '$core/utils/server-url.util';
import {getMainDefinition} from '@apollo/client/utilities';
import {OperationDefinitionNode} from 'graphql/language/ast';
import {HttpLink} from 'apollo-angular/http';
import {State} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {split,} from '@apollo/client/core';
import {WebSocketLink} from '@apollo/client/link/ws';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

const wsConnectedSubj$ = new BehaviorSubject<boolean>(false);
const wsErrorSubj$ = new BehaviorSubject<boolean>(false);
export const wsConnected$ = wsConnectedSubj$
  .pipe(
    distinctUntilChanged(),
  );
export const wsError$ = wsErrorSubj$
  .pipe(
    distinctUntilChanged(),
  );

export const createApolloLink = (httpLink: HttpLink, store: State<ApplicationState>) => {
  const getUri = (schema: 'ws://' | 'http://') => buildServerUrl(store.value.settings.server, schema);
  const http = httpLink.create({
    uri: getUri( 'http://'),
  });

  const wsClient = new SubscriptionClient(getUri('ws://'), {
    reconnect: true,
  });

  const handleConnected = () => {
    wsConnectedSubj$.next(true);
    wsErrorSubj$.next(false);
  };
  wsClient.onConnected(handleConnected);
  wsClient.onReconnected(handleConnected);
  wsClient.onDisconnected((...args) => {
    wsConnectedSubj$.next(false);
  });
  wsClient.onError((...args) => {
    wsConnectedSubj$.next(false);
    wsErrorSubj$.next(true);
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink(wsClient);

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  return split(
    // split based on operation type
    ({query}) => {
      const {kind, operation} = getMainDefinition(query) as OperationDefinitionNode;
      return (
        kind === 'OperationDefinition' && operation === 'subscription'
      );
    },
    ws,
    http,
  );
}
