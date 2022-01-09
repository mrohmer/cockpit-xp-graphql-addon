import {ChangeDetectionStrategy, Component, OnDestroy, OnInit,} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '$core/models/state';
import {filter, map, startWith, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Settings} from '$core/models/settings';
import {combineLatest, merge, Observable, Subject, throwError} from 'rxjs';
import {
  restoreDefaults,
  setDarkMode,
  setServerSettingsHost,
  setServerSettingsPort,
  setWakeLock,
} from '$core/store/settings/settings.action';
import {StringValidator} from './validators/string.validator';
import {WakeLockService} from '$core/services/wake-lock.service';

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
      server: fb.group({
        host: ['', [StringValidator.isUrl('ws://')]],
        port: ['', [Validators.min(1), Validators.max(65512)]],
      }),
      wakeLock: [],
      darkMode: [],
    } as Record<keyof Settings, any>);
  }

  ngOnInit(): void {
    this.settings$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((settings) =>
        this.form.patchValue(settings, {emitEvent: false}),
      );

    merge(
      this.connectControlToStore<string>('server', 'host').pipe(
        map((host) => setServerSettingsHost({host}))
      ),
      this.connectControlToStore<number>('server', 'port').pipe(
        map((port) => setServerSettingsPort({port}))
      ),
      this.connectControlToStore<boolean>('wakeLock').pipe(
        map((wakeLock) => setWakeLock({wakeLock}))
      ),
      this.connectControlToStore<boolean>('darkMode').pipe(
        map((darkMode) => setDarkMode({darkMode}))
      ),
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((action) => this.store.dispatch(action));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private connectControlToStore<T>(
    ...controlNames: (string|symbol)[]
  ): Observable<T> {
    const control = this.form.get(controlNames.filter(i => !!i).join('.'));
    if (!control) {
      return throwError(new Error(`unknown control: ${controlNames.filter(i => !!i).join('.')}`));
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
