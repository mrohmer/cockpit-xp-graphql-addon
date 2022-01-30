import {ChangeDetectionStrategy, Component, Inject, PLATFORM_ID} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {
  catchError,
  delay,
  distinctUntilChanged, filter,
  map,
  retry,
  retryWhen,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
import {NEVER, of, timer} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-driverscreen',
  templateUrl: './driverscreen.component.html',
  styleUrls: ['./driverscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverscreenComponent {
  isConnected$ = (isPlatformBrowser(this.platformId) ? timer(0, 1000) : NEVER)
  .pipe(
    switchMap(() =>
      this.apollo.query({
        query: gql`{track{name}}`,
        fetchPolicy: 'network-only',
      })
      .pipe(
        map(() => true),
        catchError(err => of(false)),
      )
    )
  )
  .pipe(
    distinctUntilChanged(),
    shareReplay(),
  );

  constructor(
    private apollo: DynamicUrlApolloService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }

}
