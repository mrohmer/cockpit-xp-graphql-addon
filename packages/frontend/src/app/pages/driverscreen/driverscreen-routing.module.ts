import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverscreenComponent } from './driverscreen.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DriverscreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverscreenRoutingModule {}
