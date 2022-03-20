import { Injectable } from '@angular/core';


export interface TimeTableItem {
  Date: Date;
  Ore:  number;
  Rol:  number;
  Ferie: boolean;
  Ufficio: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class DateTimeService {

  constructor() { }
  MonthlyTable:TimeTableItem[] = [];

  clear(){
    this.MonthlyTable = [];
  }

  createTable (month:number, year:number):TimeTableItem[] {
    var date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      var item:TimeTableItem = {
        Date: new Date(date),
        Ore: 8,
        Rol:0,
        Ferie: false,
        Ufficio: true, 
      }

      if(item.Date.getDay() !== 0 && item.Date.getDay() !== 6) {
        this.MonthlyTable.push(item);
      }
      date.setDate(date.getDate() + 1);
    }
    return this.MonthlyTable;
  }
}