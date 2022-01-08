import { ValidatorFn } from '@angular/forms';
import isUrl from 'is-url';

export class StringValidator {
  static isUrl(schema: string = 'https://'): ValidatorFn {
    return (control) => {
      let url = control.value?.trim() as string;
      if (!url) {
        return { isUrl: true };
      }

      url = url.replace(/^\/\//, '');
      if (!url.startsWith(schema)) {
        url = `${schema}${url}`;
      }

      try {
        if (isUrl(url)) {
          return null;
        }
      } catch (e) {}
      return { isUrl: true };
    };
  }
}
