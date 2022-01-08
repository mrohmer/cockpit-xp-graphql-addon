import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverscreenRoutingModule } from './driverscreen-routing.module';
import { DriverscreenComponent } from './driverscreen.component';

@NgModule({
  declarations: [DriverscreenComponent],
  imports: [CommonModule, DriverscreenRoutingModule],
})
export class DriverscreenModule {}
