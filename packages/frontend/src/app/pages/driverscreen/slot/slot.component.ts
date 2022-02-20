import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {filter, map, pluck, shareReplay, startWith, switchMap, takeUntil} from 'rxjs/operators';
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

  private data$ = this.activatedRoute.params
    .pipe(
      pluck('slot'),
      switchMap(slotId => iif(
        () => !!slotId,
        this.apollo.watchQuery<{ slot?: Slot, race?: Race }>({
          query: QUERY,
          variables: {slotId},
          pollInterval: 500,
        }),
        of(null),
      )),
      this.apollo.valueChanges<{ slot?: Slot, race?: Race }>({}),
      pluck('data'),
      shareReplay(),
    );

  slot$: Observable<Slot> = this.data$
      .pipe(
          pluck<unknown, Slot>('slot'),
          map(slot => !!slot ? ({
            ...slot,
            sectorStats: prepareSectorStats(slot.sectorStats)
          }) : slot),
          shareReplay(),
      )
  raceMode$ = this.data$
      .pipe(
          pluck('race'),
          map(race => race?.mode),
          shareReplay(),
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

const prepareSectorStats = (stats: SectorStats[]): SectorStats[] => {
  stats = stats ?? [];
  stats = stats.filter(
    stat => !!stat?.time?.current,
  );
  stats.sort((a, b) => a.id.localeCompare(b.id))

  if (stats.length > 3) {
    const firstHalf = stats.filter((_, index) => index + 1 <= Math.ceil(stats.length / 2));
    const secondHalf = stats.filter((_, index) => index + 1 > Math.ceil(stats.length / 2));

    stats = firstHalf
      .reduce(
        (prev, curr, index) => {
          prev = [
            ...prev,
            curr,
          ];

          if (secondHalf[index]) {
            prev = [
              ...prev,
              secondHalf[index],
            ]
          }

          return prev;
        },
        [] as SectorStats[],
      )
  }

  return stats;
}

const QUERY = gql`
    query SlotPosition($slotId: ID!) {
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
                current
                average
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
                id
                time {
                    current
                    record
                }
            }
            speedValue
            breakValue
        }
        
        race {
            mode
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
    current: number;
    average: number;
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
  sectorStats: SectorStats[];
  speedValue: number;
  breakValue: number;
}

interface SectorStats {
  id: string;
  time: SectorStat;
}

interface DistanceToPlayer {
  lap: number;
  time: number;
}

interface SectorStat {
  current: number;
  record: number;
}


interface Race {
  mode: 'QUALIFYING'|'RACE'|'TRAINING';
}
