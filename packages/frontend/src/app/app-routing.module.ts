import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorNotFoundComponent } from '$core/pages/error-not-found/error-not-found.component';

const routes: Routes = [
  {
    path: 'screen',
    loadChildren: () =>
      import('./pages/driverscreen/driverscreen.module').then(
        (m) => m.DriverscreenModule
      ),
  },
  {
    path: 'legal',
    loadChildren: () =>
      import('./pages/legal/legal.module').then((m) => m.LegalModule),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./pages/help/help.module').then((m) => m.HelpModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./pages/index/index.module').then((m) => m.IndexModule),
  },
  {
    path: '**',
    component: ErrorNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
