import { ChangeDetectionStrategy, Component } from '@angular/core';
import {DynamicUrlApolloService} from '$core/services/dynamic-url-apollo.service';

@Component({
  selector: 'app-driverscreen',
  templateUrl: './driverscreen.component.html',
  styleUrls: ['./driverscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverscreenComponent {
  isConnected$ = this.apollo.wsIsConnected();
  constructor(private apollo: DynamicUrlApolloService) {}

}
