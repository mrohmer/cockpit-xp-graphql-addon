import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {map, pluck, shareReplay, switchMap} from 'rxjs/operators';
import {iif, Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {subscribe} from 'graphql';
import {FetchResult} from '@apollo/client/core';
import {Slot} from '../models/slot';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotComponent {
  slots$: Observable<SlotsResponse['slots']> = this.apollo
    .subscribe<SlotsResponse>({
      query: SLOTS_SUBSCRIPTION,
    })
    .pipe(
      map(r => r.data?.slots ?? []),
      shareReplay(),
    )
  ;


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

const SLOTS_SUBSCRIPTION = gql`
    subscription Slots {
        slots {
            id
            driver {
                name
            }
        }
    }
`;
const SLOT_DETAIL_SUBSCRIPTION = gql`
    subscription SlotPosition($slotId: ID!) {
        slot(id: $slotId) {
            position
            driver {
                name
            }
            lap
            remainingLaps
            lapTime {
                Best
                Diff
                Last
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

interface SlotsResponse {
  slots: {
    id: string;
    driver: {
      name: string;
    }
  }[]
}

