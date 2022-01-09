import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';
import {gql} from 'apollo-angular';
import {map, pluck, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

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


  slotId$ = this.activatedRoute.queryParams
    .pipe(
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

interface SlotsResponse {
  slots: {
    id: string;
    driver: {
      name: string;
    }
  }[]
}
