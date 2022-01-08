import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-row',
  templateUrl: './settings-row.component.html',
  styleUrls: ['./settings-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRowComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
