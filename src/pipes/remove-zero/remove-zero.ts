import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeZero',
})
export class RemoveZeroPipe implements PipeTransform {
  transform(value: string) {
    return value.replace(/\.?0+$/g, '');
  }
}
