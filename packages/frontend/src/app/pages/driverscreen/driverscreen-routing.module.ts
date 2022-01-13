import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverscreenComponent } from './driverscreen.component';
import {SlotComponent} from './slot/slot.component';
import {SlotListComponent} from './slot-list/slot-list.component';

const routes: Routes = [
  {
    path: '',
    component: DriverscreenComponent,
    children: [
      {
        path: ':slot',
        component: SlotComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: SlotListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverscreenRoutingModule {}
