import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, map, take } from 'rxjs/operators';

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

  //-------- Test of an Observable Strong ---------
  private _text: BehaviorSubject<string> = new BehaviorSubject('');
  text$:Observable<string> = this._text.asObservable();
  
  updateText(hello:string){
    this._text.next(hello);
    this.text$ = this._text;
  }
  //--------------End of Test ----------------------

  //*Here, we create BehaviorSubject of type TimeTableItem[]. Behavior expects us to provide an initial value. We assign an empty array. The BehaviorSubject will always emit the latest list of TimeTableItem items as an array.
  private readonly _MonthlyTable:BehaviorSubject<any> = new BehaviorSubject([]);
  //*Also, it is advisable not to expose the BehaviorSubject outside the service. Hence we convert it to normal Observable and return it. This is because the methods like next, complete or error do not exist on normal observable.
  MonthlyTable$: Observable<TimeTableItem[]> = this._MonthlyTable.asObservable();
  //*The MonthlyTable will store the todo items in memory.
  private MonthlyTable:TimeTableItem[] = [];

  constructor() { }

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
    this._MonthlyTable.next(Object.assign([], this.MonthlyTable));
    return;
  }

  clear(){
    this.MonthlyTable = [];
    this._MonthlyTable.next(Object.assign([], this.MonthlyTable));
  }

  updateTable(dataSource:TimeTableItem[]){
    //Clear Table so I don't have repeated values
    this._MonthlyTable.next([]);
    this.MonthlyTable$ = of([]);
    //Add Complete updated table
    this._MonthlyTable.next(dataSource);
    this.MonthlyTable$ = this._MonthlyTable;
  }

  getNewMonth(direction: string):void {
      const data = this.MonthlyTable.length > 0 ? {'currentMonth': this.MonthlyTable[0].Date.getMonth(), 'currentYear':this.MonthlyTable[0].Date.getFullYear()} : {'currentMonth':-10, 'currentYear':-10};
      if(data.currentMonth == -10) {
        alert("Something Wrong Happend!!!");
        return;
      }
      const newMonth = direction == 'up' ? data.currentMonth + 1 : data.currentMonth -1;
      const checkedData = this.checkNewYear(newMonth,data.currentYear);
      this.clear();
      this.createTable(checkedData.month,checkedData.year);    
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
    return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Ore, 0)));
  }

  getWorkingDays():Observable<number>{
    return this.MonthlyTable$.pipe(map(result=> result.filter(item=> item.Ferie === false).length));
  }

  getHolidays(): Observable<number>{
    return this.MonthlyTable$.pipe(map(result => result.filter(item => item.Ferie === true).length));
  }
  
  getOfficeDays():Observable<number>{
    return this.MonthlyTable$.pipe(map(result => result.filter(item => item.Ferie === false && item.Ufficio === true).length));
  }

  getTotalWorkingDays(){
    return this.MonthlyTable$.pipe(map(result => result.length));
  }

  getCurrentMonth():Observable<Date>{
    return this.MonthlyTable$.pipe(map(res => res.length> 0 ? res[0].Date : new Date())); //Add a Control because when I clear the array it cannot read the property Date and fail.
  }
}