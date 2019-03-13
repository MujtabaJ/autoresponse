import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string, ...args) {
    //return value.toLowerCase();
    console.log(value);
    let formatDate = '';
    let today = moment();

    if(moment(value).isSame(today, 'day')) formatDate = moment(value).format("HH:mm")
    else formatDate = moment(value).format("DD MMM");

    return formatDate;
  }

}
