import {Injectable} from '@angular/core';
import {Apollo, ApolloBase} from 'apollo-angular';
import {EmptyObject, ExtraSubscriptionOptions, WatchQueryOptions} from 'apollo-angular/types';
import {ApolloQueryResult, FetchResult, MutationOptions, QueryOptions, SubscriptionOptions} from '@apollo/client/core';
import {Observable, of} from 'rxjs';
import {State} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {distinctUntilChanged, map, pairwise, pluck, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {buildServerUrl} from '$core/utils/server-url.util';
import {QueryRef} from 'apollo-angular/query-ref';
import {createApolloLink, wsConnected$, wsError$} from '$core/utils/apollo-link.util';
import {HttpLink} from 'apollo-angular/http';

@Injectable({
  providedIn: 'root'
})
export class DynamicUrlApolloService {

  private onUrlChange$ = this.state
    .pipe(
      tap(data => console.log('on url change', data)),
      pluck('settings', 'server'),
      map(server => buildServerUrl(server)),
      startWith(''),
      distinctUntilChanged(),
      pairwise(),
      map(([oldUrl, newUrl]) => {
        if (oldUrl) {
          this.apollo.removeClient(oldUrl);
        }
        this.apollo.create({
          ...this.apollo.client,
          link: createApolloLink(this.httpLink, this.state),
        }, newUrl);
        this.apollo.removeClient()
        return this.apollo.use(newUrl);
      }),
      shareReplay(),
    );

  constructor(
    private state: State<ApplicationState>,
    private httpLink: HttpLink,
    private apollo: Apollo,
  ) {
  }


  private execOnUrlChange<T>(project: (client: ApolloBase) => Observable<T>): Observable<T> {
    return this.onUrlChange$
      .pipe(
        switchMap((client) => project(client)),
      )
  }
  watchQuery<TData, TVariables = EmptyObject>(options: WatchQueryOptions<TVariables, TData>): Observable<QueryRef<TData, TVariables>> {
    return this.execOnUrlChange((client) => of(client.watchQuery(options)));
  }
  query<T, V = EmptyObject>(options: QueryOptions<V, T>): Observable<ApolloQueryResult<T>> {
    return this.execOnUrlChange((client) => client.query(options));
  }
  mutate<T, V = EmptyObject>(options: MutationOptions<T, V>): Observable<FetchResult<T>> {
    return this.execOnUrlChange((client) => client.mutate(options));
  }
  subscribe<T, V = EmptyObject>(options: SubscriptionOptions<V, T>, extra?: ExtraSubscriptionOptions): Observable<FetchResult<T>> {
    return this.execOnUrlChange((client) => client.subscribe(options, extra));
  }

  wsIsConnected() {
    return wsConnected$;
  }
  wsHasError() {
    return wsError$;
  }
}
