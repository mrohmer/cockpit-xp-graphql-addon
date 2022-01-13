import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverscreenComponent } from './driverscreen.component';

describe('DriverscreenComponent', () => {
  let component: DriverscreenComponent;
  let fixture: ComponentFixture<DriverscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverscreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
