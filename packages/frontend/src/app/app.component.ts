import {
  ChangeDetectionStrategy,
  Component, HostBinding, OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Storage } from '$core/models/storage';
import {ApplicationState} from '$core/models/state';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class.dark') darkMode = false;

  private destroyed$ = new Subject();

  constructor(
    private readonly renderer: Renderer2,
    private readonly store: Store<ApplicationState>
  ) {}

  ngOnInit() {
    this.renderer.listen('window', 'storage', (event) => {
      this.store.dispatch(new Storage(event.key));
    });

    this.store.select('settings', 'darkMode')
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(darkMode => this.darkMode = darkMode);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
