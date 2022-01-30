import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Apollo, ApolloBase} from 'apollo-angular';
import {EmptyObject, ExtraSubscriptionOptions, WatchQueryOptions} from 'apollo-angular/types';
import {ApolloQueryResult, FetchResult, MutationOptions, QueryOptions, SubscriptionOptions} from '@apollo/client/core';
import {NEVER, Observable, of, OperatorFunction} from 'rxjs';
import {State} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {
  delay,
  distinctUntilChanged,
  map,
  pairwise,
  pluck,
  retryWhen,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs/operators';
import {buildServerUrl} from '$core/utils/server-url.util';
import {QueryRef} from 'apollo-angular/query-ref';
import {createApolloLink} from '$core/utils/apollo-link.util';
import {HttpLink} from 'apollo-angular/http';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DynamicUrlApolloService {

  private onUrlChange$ = this.state
    .pipe(
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
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }


  private execOnUrlChange<T>(project: (client: ApolloBase) => Observable<T>): Observable<T> {
    if (!isPlatformBrowser(this.platformId)) {
      return NEVER;
    }
    return this.onUrlChange$
      .pipe(
        switchMap((client) => project(client)),
      )
  }
  watchQuery<TData, TVariables = EmptyObject>(options: WatchQueryOptions<TVariables, TData>): Observable<QueryRef<TData, TVariables>> {
    return this.execOnUrlChange((client) => of(client.watchQuery({
      ...options,
      errorPolicy: options?.errorPolicy ?? 'all',
    })));
  }
  query<T, V = EmptyObject>(options: QueryOptions<V, T>): Observable<ApolloQueryResult<T>> {
    return this.execOnUrlChange((client) => client.query({
      ...options,
      errorPolicy: options?.errorPolicy ?? 'all',
    }));
  }
  mutate<T, V = EmptyObject>(options: MutationOptions<T, V>): Observable<FetchResult<T>> {
    return this.execOnUrlChange((client) => client.mutate({
      ...options,
      errorPolicy: options?.errorPolicy ?? 'all',
    }));
  }
  subscribe<T, V = EmptyObject>(options: SubscriptionOptions<V, T>, extra?: ExtraSubscriptionOptions): Observable<FetchResult<T>> {
    return this.execOnUrlChange((client) => client.subscribe({
      ...options,
      errorPolicy: options?.errorPolicy ?? 'all',
    }, extra));
  }

  valueChanges<TData, TVariables = EmptyObject>(defaultData?: TData): OperatorFunction<QueryRef<TData, TVariables>|undefined|null, ApolloQueryResult<TData>> {
    return source => source.pipe(
      switchMap(query => query?.valueChanges ?? (defaultData ? of({data: defaultData} as ApolloQueryResult<TData>) : NEVER)),
      retryWhen(errors => errors.pipe(delay(500 * (Math.random() + 1))))
    );
  }
}
