import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from '$core/models/state';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Settings } from '$core/models/settings';
import { combineLatest, merge, Observable, Subject, throwError } from 'rxjs';
import {
  restoreDefaults, setDarkMode,
  setWakeLock,
  setWebsocketUrl,
} from '$core/store/settings/settings.action';
import { StringValidator } from './validators/string.validator';
import { WakeLockService } from '$core/services/wake-lock.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  private settings$ = this.store.select('settings');

  form: FormGroup;

  constructor(
    private store: Store<ApplicationState>,
    public wakeLockService: WakeLockService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      websocketUrl: ['', [StringValidator.isUrl('ws://')]],
      wakeLock: [],
      darkMode: [],
    } as Record<keyof Settings, any>);
  }

  ngOnInit(): void {
    this.settings$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((settings) =>
        this.form.patchValue(settings, { emitEvent: false })
      );

    merge(
      this.connectControlToStore('websocketUrl').pipe(
        map((websocketUrl) => setWebsocketUrl({ websocketUrl }))
      ),
      this.connectControlToStore('wakeLock').pipe(
        map((wakeLock) => setWakeLock({ wakeLock }))
      ),
      this.connectControlToStore('darkMode').pipe(
        map((darkMode) => setDarkMode({ darkMode }))
      ),
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((action) => this.store.dispatch(action));
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private connectControlToStore<K extends keyof Settings, T = Settings[K]>(
    controlName: K
  ): Observable<T> {
    const control = this.form.get(controlName);
    if (!control) {
      return throwError(new Error('unknown control'));
    }
    return combineLatest([
      control.valueChanges,
      control.statusChanges.pipe(startWith(control.status)),
    ]).pipe(
      takeUntil(this.destroyed$),
      filter(([, status]) => status === 'VALID'),
      map(([value]) => value)
    );
  }

  restoreDefaults() {
    this.store.dispatch(restoreDefaults());
  }
}
