import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DriverscreenRoutingModule} from './driverscreen-routing.module';
import {DriverscreenComponent} from './driverscreen.component';
import {SlotComponent} from './slot/slot.component';
import {TimePipe} from './pipes/time.pipe';
import {SlotListComponent} from './slot-list/slot-list.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [DriverscreenComponent, SlotComponent, TimePipe, SlotListComponent],
  imports: [CommonModule, DriverscreenRoutingModule, SharedModule],
})
export class DriverscreenModule {}
