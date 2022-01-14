import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {filter, pluck, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {combineLatest, defer, fromEvent, iif, merge, Observable, of, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {WakeLockService} from '$core/services/wake-lock.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotComponent implements OnInit, OnDestroy {

  private destroyed$ = new Subject();

  slot$: Observable<Slot> = this.activatedRoute.params
    .pipe(
      pluck('slot'),
      switchMap(slotId => iif(
        () => !!slotId,
        this.apollo.subscribe<{ slot: Slot }>({
          query: SLOT_DETAIL_SUBSCRIPTION,
          variables: {slotId},
        }),
        of({data: {slot: null}})
      )),
      pluck('data'),
      pluck('slot'),
    );

  constructor(
    private apollo: DynamicUrlApolloService,
    private activatedRoute: ActivatedRoute,
    private wakeLock: WakeLockService,
    private store: Store<ApplicationState>,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngOnInit(): void {
    this.store.select('settings', 'wakeLock')
      .pipe(
        filter((useWakeLock) => useWakeLock && this.wakeLock.isSupported),
        switchMap(() => this.wakeLock.request()),
        takeUntil(this.destroyed$),
      )
      .subscribe()
    ;
    if (isPlatformBrowser(this.platformId)) {
      combineLatest([
        this.store.select('settings', 'autoFullscreen'),
        merge(
          fromEvent(this.document, 'visibilitychange'),
          fromEvent(window, 'focus'),

        ).pipe(
          startWith(true),
        ),
      ])
        .pipe(
          filter(() => this.document.visibilityState === 'visible'),
          switchMap(([autoFullscreen]) => iif(
            () => autoFullscreen,
            defer(() => this.document.body.requestFullscreen()),
            defer(() => this.document.exitFullscreen()),
          )),
          takeUntil(this.destroyed$),
        )
        .subscribe(
          () => undefined,
          () => undefined,
          () => this.document.exitFullscreen(),
        );
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

const SLOT_DETAIL_SUBSCRIPTION = gql`
    subscription SlotPosition($slotId: ID!) {
        slot(id: $slotId) {
            position
            driver {
                name
                car
            }
            lap
            remainingLaps
            lapTime {
                best
                last
            }
            penalties {
                status
                type
            }
            boxStops
            fuel
            isRefueling
            distanceToLeader {
                lap
                time
            }
            distanceToNext {
                lap
                time
            }
            sectorStats {
                time {
                    current
                    record
                }
                speed {
                    current
                    record
                }
            }

        }
    }
`

interface Slot {
  position: number;
  driver: {
    name: string;
    car: string;
  };
  lap: number;
  remainingLaps: number;
  lapTime: {
    best: number;
    last: number;
  };
  penalties: {
    status: string;
    type: string;
  }[];
  boxStops: number;
  fuel: number;
  isRefueling: boolean;
  distanceToLeader: DistanceToPlayer
  distanceToNext: DistanceToPlayer;
  sectorStats: {
    time: SectorStat;
    speed: SectorStat;
  }[];
}

interface DistanceToPlayer {
  lap: number;
  time: number;
}

interface SectorStat {
  current: number;
  record: number;
}


