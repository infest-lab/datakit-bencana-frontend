import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'fullDate',
  pure: false,
})
export class FullDateTimeFormatPipe implements PipeTransform {
  transform(date: string, format: string = 'YYYY-MM-DDTHH:mm:ssz'): string {
    return moment(date).format(format);
  }
}