import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'seriecase',
})
export class SerieCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .map((word) => (word.length < 3 ? word.toUpperCase() : word))
      .join(' ');
  }
}
