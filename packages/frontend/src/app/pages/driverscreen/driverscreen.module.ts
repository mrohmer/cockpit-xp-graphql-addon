import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverscreenRoutingModule } from './driverscreen-routing.module';
import { DriverscreenComponent } from './driverscreen.component';
import { SlotComponent } from './slot/slot.component';
import { SlotDetailsComponent } from './components/slot-details/slot-details.component';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
  declarations: [DriverscreenComponent, SlotComponent, SlotDetailsComponent, TimePipe],
  imports: [CommonModule, DriverscreenRoutingModule],
})
export class DriverscreenModule {}
