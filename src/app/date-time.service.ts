import { isNgTemplate } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TimeTableItem {
  Date: Date;
  Ore:  number;
  Rol:  number;
  Ferie: boolean;
  Ufficio: boolean;
}

export interface Holiday {
  Name:String;
  Date:Date;
  Weekend: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class DateTimeService {
  
  //------Holidays--------------
  Holidays: Holiday [] = 
  [
    {Name: "Dopo Capodanno", Date: new Date(2022,0,1), Weekend: true},
    {Name: "Epifania", Date: new Date(2022,0,6), Weekend: false},
    {Name: "Pasqua", Date: new Date(2022,3,17), Weekend: true},
    {Name: "Pasquetta", Date: new Date(2022,3,18), Weekend: false},
    {Name: "Anniversarop della Liberzaione d'Italia", Date: new Date(2022,3,25),Weekend: false},
    {Name: "Festa dei Lavoratori", Date: new Date(2022,4,1), Weekend: true},
    {Name: "Festa della Repubblica Italiana", Date: new Date(2022,5,2),Weekend: false},
    {Name: "Ferragosto", Date: new Date(2022,7,15),Weekend: false},
    {Name: "Tutti i Santi", Date: new Date(2022,10,1),Weekend: false},
    {Name: "Sant'Ambrogio", Date: new Date(2022,11,7),Weekend: false},
    {Name: "L'Immacolata Concezione", Date: new Date(2022,11,8),Weekend: false},
    {Name: "Natale", Date: new Date(2022,11,25), Weekend: true},
    {Name: "Santo Stefano", Date: new Date(2022,11,26),Weekend: false},
  ]

  gHolidays:Holiday[] = [];

  //-------- Test of an Observable Strong ---------
  private _text: BehaviorSubject<string> = new BehaviorSubject('');
  text$:Observable<string> = this._text.asObservable();
  
  updateText(hello:string){
    this._text.next(hello);
    this.text$ = this._text;
  }
  //--------------End of Test ----------------------

  //* Here, we create BehaviorSubject of type TimeTableItem[]. Behavior expects us to provide an initial value. We assign an empty array. The BehaviorSubject will always emit the latest list of TimeTableItem items as an array.
  private readonly _MonthlyTable:BehaviorSubject<any> = new BehaviorSubject([]);
  //* Also, it is advisable not to expose the BehaviorSubject outside the service. Hence we convert it to normal Observable and return it. This is because the methods like next, complete or error do not exist on normal observable.
  MonthlyTable$: Observable<TimeTableItem[]> = this._MonthlyTable.asObservable();
  //* The MonthlyTable will store the todo items in memory.
  private MonthlyTable:TimeTableItem[] = [];

  constructor() { }

  isHoliday(itemDate: Date): Boolean {
    return this.Holidays.some(h => h.Date.getTime() == itemDate.getTime())
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
         if(!this.isHoliday(item.Date))
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

  getRemaindingWorkDays() :number {
    let counter = 0;
    let dateObj = new Date();
    let currMonth = dateObj.getMonth(); 
    while (dateObj.getMonth() === currMonth) {
     
      if(dateObj.getDay() !== 0 && dateObj.getDay() !== 6) {
        counter +=1;
      }
      dateObj.setDate(dateObj.getDate() + 1);
    }
    return counter;
  }

  getCurrentMonthTotalWorkDays():number {
    let counter = 0;
    let dateObj = new Date();
    let currMonth = dateObj.getMonth();
    let currYear =  dateObj.getFullYear();
    let date = new Date(currYear, currMonth, 1);
    while (date.getMonth() === currMonth) {

      if(date.getDay() !== 0 && date.getDay() !== 6) {
         if(!this.isHoliday(date)){ //* Need to exclude Weeday Holidays from the count
           counter +=1;
         }        
      }
      //* This Set the Number of Holidays in the Month!
      let index = this.Holidays.findIndex((x => x.Date.toISOString() === date.toISOString()));
      if(index > 0) {
         this.gHolidays.push(this.Holidays[index]);
      }
      date.setDate(date.getDate() + 1);
    }

    return counter;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
 }
  //* OBSERVABLE SECCION FOR STATISTICS
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

  getTotalRolHours():Observable<number>{
    return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Rol, 0)));
  }

  getTotalWorkingDays(){
    return this.MonthlyTable$.pipe(map(result => result.length));
  }

  getMonthInTable():Observable<Date>{
    return this.MonthlyTable$.pipe(map(res => res.length> 0 ? res[0].Date : new Date()), //Add a Control because when I clear the array it cannot read the property Date and fail.
      catchError(this.handleError<any>('new Date()'))
    );
  }
  
  //* SECTION FOR XLS return normal values

  getNormalWorkingDays():number{
    return this.MonthlyTable.filter(item=> item.Ferie === false).length;
  }

  getNormalHolidays(): number {
    return this.MonthlyTable.filter(item => item.Ferie === true).length;
  }
  
  getNormalOfficeDays():number {
    return this.MonthlyTable.filter(item => item.Ferie === false && item.Ufficio === true).length;
  }

  getNormalTotalRolHours(): number {
    return this.MonthlyTable.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Rol, 0);
  }

}