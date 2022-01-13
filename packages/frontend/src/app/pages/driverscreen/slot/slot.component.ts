import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {pluck, switchMap} from 'rxjs/operators';
import {iif, Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotComponent {

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
  ) {
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
                diff
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
    Best: number;
    Diff: number;
    Last: number;
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


