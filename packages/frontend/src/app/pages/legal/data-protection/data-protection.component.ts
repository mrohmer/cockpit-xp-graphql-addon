import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataProtectionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
