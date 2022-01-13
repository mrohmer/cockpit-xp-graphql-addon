import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from './components/cell/cell.component';
import { CellSubLineDirective } from './directives/cell-sub-line.directive';
import { CellSuperLineDirective } from './directives/cell-super-line.directive';
import { CellPercentageDirective } from './directives/cell-percentage.directive';
import { CellBadgeDirective } from './directives/cell-badge.directive';



@NgModule({
  declarations: [
    CellComponent,
    CellSubLineDirective,
    CellSuperLineDirective,
    CellPercentageDirective,
    CellBadgeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CellComponent,
    CellSubLineDirective,
    CellSuperLineDirective,
    CellPercentageDirective,
    CellBadgeDirective
  ]
})
export class SharedModule { }
