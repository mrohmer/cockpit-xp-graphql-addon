import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Slot} from '../../models/slot';

@Component({
  selector: 'app-slot-details',
  templateUrl: './slot-details.component.html',
  styleUrls: ['./slot-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotDetailsComponent {
  @Input() slot?: Slot;
}
