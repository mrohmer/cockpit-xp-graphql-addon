import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    if (!value || value <= 0) {
      return '00:00.000';
    }
    const millis = (value % 1000);
    const sec = String(Math.floor(value / 1000) % 60).padStart(2, '0');
    const min = Math.floor(value / 60000);
    return `${min}:${sec}.${millis.toFixed(0).padStart(3, '0')}`;
  }

}
