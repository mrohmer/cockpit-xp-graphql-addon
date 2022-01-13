import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {filter, pluck, switchMap, takeUntil, tap} from 'rxjs/operators';
import {iif, Observable, of, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {WakeLockService} from '$core/services/wake-lock.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    tap(console.log),
    pluck('data'),
    pluck('slot'),
  );

  constructor(
    private apollo: DynamicUrlApolloService,
    private activatedRoute: ActivatedRoute,
    private wakeLock: WakeLockService,
    private store: Store<ApplicationState>,
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


