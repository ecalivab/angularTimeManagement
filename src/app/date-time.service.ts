import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, isEmpty } from 'rxjs/operators';

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

  MonthlyTable:Observable<TimeTableItem[]> = of([]);

  clear(){
    this.MonthlyTable = of([]);
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
        this.MonthlyTable.subscribe(result => result.push(item));
      }
      date.setDate(date.getDate() + 1);
    }
    return;
  }

  getNewMonth(direction: string):void {
    this.MonthlyTable.subscribe (table=> {
      const data = table.length > 0 ? {'currentMonth': table[0].Date.getMonth(), 'currentYear':table[0].Date.getFullYear()} : {'currentMonth':-10, 'currentYear':-10};
      const newMonth = direction == 'up' ? data.currentMonth + 1 : data.currentMonth -1;
      const checkedData = this.checkNewYear(newMonth,data.currentYear);
      this.clear();
      this.createTable(checkedData.month,checkedData.year);
    })    
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

  getTotalHours():Observable<number> {
    return this.MonthlyTable.pipe(map(result => result.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Ore, 0)));
  }

  getWorkingDays():Observable<number>{
    return this.MonthlyTable.pipe(map(result=> result.filter(item=> item.Ferie === false).length));
  }

  getHolidays(): Observable<number>{
    return this.MonthlyTable.pipe(map(result => result.filter(item => item.Ferie === true).length));
  }
  
  getOfficeDays():Observable<number>{
    return this.MonthlyTable.pipe(map(result => result.filter(item => item.Ferie === false && item.Ufficio === true).length));
  }

  getTotalWorkingDays(){
    return this.MonthlyTable.pipe(map(result => result.length));
  }

}