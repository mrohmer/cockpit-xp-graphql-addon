import {buildServerUrl} from '$core/utils/server-url.util';
import {getMainDefinition} from '@apollo/client/utilities';
import {OperationDefinitionNode} from 'graphql/language/ast';
import {HttpLink} from 'apollo-angular/http';
import {State} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {split,} from '@apollo/client/core';
import {WebSocketLink} from '@apollo/client/link/ws';

export const createApolloLink = (httpLink: HttpLink, store: State<ApplicationState>) => {
  const getUri = (schema: 'ws://' | 'http://') => buildServerUrl(store.value.settings.server, schema);
  const http = httpLink.create({
    uri: getUri( 'http://'),
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: getUri('ws://'),
    options: {
      reconnect: true,
    },
  });

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
