import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsRowComponent } from './components/settings-row/settings-row.component';
import { SettingsHeadlineDirective } from './directives/settings-headline.directive';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsRowComponent,
    SettingsHeadlineDirective,
  ],
  imports: [CommonModule, SettingsRoutingModule, ReactiveFormsModule],
})
export class SettingsModule {}
