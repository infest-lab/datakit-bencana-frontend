import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'fromNow',
  pure: false,
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(date: string, format: string = 'YYYY-MM-DDTHH:mm:ssZz'): string {
    return moment(date, format).fromNow();
  }
}