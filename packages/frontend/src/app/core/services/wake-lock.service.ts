import { Inject, Injectable } from '@angular/core';
import {
  defer,
  fromEvent,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WakeLockService {
  private lock?: any;
  private listener?: Subscription;

  private get isWakeLockSupported(): boolean {
    return 'wakeLock' in navigator;
  }
  private get isKeepAwakeSupported(): boolean {
    return 'keepAwake' in screen;
  }

  isSupported = this.isWakeLockSupported || this.isKeepAwakeSupported;

  constructor(@Inject(DOCUMENT) private document: any) {}

  request(): Observable<void> {
    if (this.isWakeLockSupported) {
      return fromEvent(document, 'visibilitychange').pipe(
        startWith(0),
        filter(() => document.visibilityState === 'visible'),
        switchMap(() =>
          defer(async () => {
            try {
              if (!this.lock || this.lock?.released) {
                this.lock = await (navigator as any).wakeLock?.request(
                  'screen'
                );
              }
              return this.lock;
            } catch (e) {
              // can happen when e.g. the battery is low
              throw e;
            }
          })
        ),
        finalize(() => {
          this.lock?.release();
          this.lock = undefined;
        })
      );
    }
    if (this.isKeepAwakeSupported) {
      return new Observable<void>((subscriber) => {
        (screen as any).keepAwake = true;
        subscriber.next();
        return () => {
          (screen as any).keepAwake = false;
        };
      });
    }
    return throwError(new Error('WakeLock is not supported'));
  }
}
