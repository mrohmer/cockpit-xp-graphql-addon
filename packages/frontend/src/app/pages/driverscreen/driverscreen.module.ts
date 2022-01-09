import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverscreenRoutingModule } from './driverscreen-routing.module';
import { DriverscreenComponent } from './driverscreen.component';
import { SlotComponent } from './slot/slot.component';

@NgModule({
  declarations: [DriverscreenComponent, SlotComponent],
  imports: [CommonModule, DriverscreenRoutingModule],
})
export class DriverscreenModule {}
