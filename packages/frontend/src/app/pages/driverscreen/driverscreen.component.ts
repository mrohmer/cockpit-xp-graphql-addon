import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driverscreen',
  templateUrl: './driverscreen.component.html',
  styleUrls: ['./driverscreen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverscreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
