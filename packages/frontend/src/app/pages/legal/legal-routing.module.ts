import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';

const routes: Routes = [
  {
    path: 'imprint',
    pathMatch: 'full',
    component: ImprintComponent,
  },
  {
    path: 'data-protection',
    pathMatch: 'full',
    component: DataProtectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {}
