import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {

  @Input()
  color: 'plain'|'blue'|'green'|'yellow' = 'plain';
  @HostBinding('class.cell--uppercase')
  @Input()
  uppercase: boolean = true;
  @HostBinding('class.cell--centered')
  @Input()
  centered: boolean = false;

  @HostBinding('class.cell--big')
  @Input()
  big: boolean = false;

  @HostBinding('class.cell--blue')
  get classBlue(): boolean {
    return this.color === 'blue';
  }
  @HostBinding('class.cell--green')
  get classGreen(): boolean {
    return this.color === 'green';
  }
  @HostBinding('class.cell--yellow')
  get classYellow(): boolean {
    return this.color === 'yellow';
  }

}
