import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsHeadlineDirective } from './directives/settings-headline.directive';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsHeadlineDirective,
  ],
  imports: [CommonModule, SettingsRoutingModule, ReactiveFormsModule, SharedModule],
})
export class SettingsModule {}
