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

  createTable (month:number, year:number):void {
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
    return;
  }

  getCurrentMonthYear() {
    if (this.MonthlyTable.length > 0) {
      let currentMonth = this.MonthlyTable[0].Date.getMonth(),
          currentYear  = this.MonthlyTable[0].Date.getFullYear();
      return {currentMonth, currentYear};
    }
    return {'currentMonth':-10, 'currentYear':-10};
  }
  
  checkNewYear(month:number, year:number){
    if(month > 11) {
      year+=1;
      month = 0;
      return {month, year};
    }
    if(month < 0) {
      year-=1;
      month = 11;
      return {month, year};
    }
    return {month, year};
  }

}