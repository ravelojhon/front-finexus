import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: string = 'short'): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case 'short':
        options.dateStyle = 'short';
        options.timeStyle = 'short';
        break;
      case 'long':
        options.dateStyle = 'long';
        break;
      case 'time':
        options.timeStyle = 'short';
        break;
      case 'date':
        options.dateStyle = 'short';
        break;
      default:
        options.dateStyle = 'short';
    }

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
}
