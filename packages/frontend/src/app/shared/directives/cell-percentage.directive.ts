import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[appCellPercentage]'
})
export class CellPercentageDirective {
  @HostBinding('class.cell__percentage') staticClass = true;

  @HostBinding('style.width.%')
  @Input('appCellPercentage')
  percentage = 0;

  @HostBinding('class.cell__percentage--warning')
  @Input()
  warning = false;
}
