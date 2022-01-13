import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';

@NgModule({
  declarations: [ImprintComponent, DataProtectionComponent],
  imports: [CommonModule, LegalRoutingModule],
})
export class LegalModule {}
