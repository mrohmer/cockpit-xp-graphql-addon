import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[appCellSubLine]'
})
export class CellSubLineDirective {

  @HostBinding('class.has-background')
  @Input()
  hasBackground = false;

  constructor() { }

}
