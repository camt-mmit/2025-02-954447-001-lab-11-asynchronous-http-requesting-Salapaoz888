import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNumber',
})
export class IsNumberPipe implements PipeTransform {
  transform(value: unknown): boolean {
    return (
      typeof value !== 'undefined' && value !== null && value !== '' && !Number.isNaN(Number(value))
    );
  }
}
