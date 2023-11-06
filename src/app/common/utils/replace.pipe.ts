import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, replaceFrom: string, replaceTo: string): string {
    return value.replaceAll(replaceFrom, replaceTo);
  }
}
