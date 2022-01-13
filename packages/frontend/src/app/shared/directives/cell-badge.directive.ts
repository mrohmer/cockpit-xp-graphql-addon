import {Directive, HostBinding} from '@angular/core';

@Directive({
  selector: '[appCellBadge]'
})
export class CellBadgeDirective {

  @HostBinding('class.cell__badge') staticClass = true;

}
