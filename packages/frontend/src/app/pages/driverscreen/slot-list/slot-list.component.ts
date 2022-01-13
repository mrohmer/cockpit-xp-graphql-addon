import {ChangeDetectionStrategy, Component} from '@angular/core';
import {gql} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';

@Component({
  selector: 'app-slot-list',
  templateUrl: './slot-list.component.html',
  styleUrls: ['./slot-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotListComponent {

  slots$: Observable<SlotsResponse['slots']> = this.apollo
    .subscribe<SlotsResponse>({
      query: SLOTS_SUBSCRIPTION,
    })
    .pipe(
      map(r => r.data?.slots ?? []),
      shareReplay(),
    )
  ;

  constructor(
    private apollo: DynamicUrlApolloService,
  ) {
  }
}

const SLOTS_SUBSCRIPTION = gql`
    subscription Slots {
        slots {
            id
            driver {
                name
                car
            }
        }
    }
`;

interface SlotsResponse {
  slots: {
    id: string;
    driver: {
      name: string;
      car: string;
    }
  }[]
}
