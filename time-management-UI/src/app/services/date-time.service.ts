import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Holiday, HOLIDAYS, TimeTableInfo, TimeTableItem, TimeTableRequest } from '../models/time-table';
import { TimeTableStore } from '../store/time-table.store';

@Injectable({
  providedIn: 'root'
})


export class DateTimeService {

  holidays = HOLIDAYS
  gHolidays:Holiday[] = [];

  // -------- Test of an Observable Strong ---------
  private _text: BehaviorSubject<string> = new BehaviorSubject('');
  text$:Observable<string> = this._text.asObservable();
  
  updateText(hello:string){
    this._text.next(hello);
    this.text$ = this._text;
  }
  //--------------End of Test ----------------------


  //* The MonthlyTable will store the todo items in memory.
  private MonthlyTable: TimeTableItem[] = [];

  constructor(
    private readonly timeTableStore: TimeTableStore,
    private readonly httpClient: HttpClient) { }


  //--------------- API CALLS-----------------------
  readonly url: string = environment.apiURL
  readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' })
  }

  saveTable(table: TimeTableRequest[]) : Observable<any> {
    return this.httpClient.post(`${this.url}/TimeTable/save`, table).pipe(catchError(this.handleError))
  }
  
   // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => msg);
  }

  //----------------END API CALLS---------------------


  isHoliday(itemDate: Date): Boolean {
    return this.holidays.some(h => h.Date.getTime() == itemDate.getTime())
  }

  createTable (month: number, year: number): void {
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
    this.timeTableStore.updateTimeTable(this.MonthlyTable)
    return;
  }


  clear(){
    this.MonthlyTable = [];
    this.timeTableStore.clear();
  }

  updateTableOnChange(dataSource: TimeTableItem[]) {
    this.timeTableStore.updateTimeTableOnChange(dataSource);
  }

  getNewMonth(direction: string): void {
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

  checkNewYear(month: number, year: number): any {
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

  getRemaindingWorkDays(): number {
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

  getCurrentMonthTotalWorkDays(): number {
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
      let index = this.holidays.findIndex((x => x.Date.toISOString() === date.toISOString()));
      if(index > 0) {
         this.gHolidays.push(this.holidays[index]);
      }
      date.setDate(date.getDate() + 1);
    }

    return counter;
  }
 
  //* SECTION FOR XLS return normal values

  getNormalWorkingDays(): number{
    return this.MonthlyTable.filter(item=> item.Ferie === false).length;
  }

  getNormalHolidays(): number {
    return this.MonthlyTable.filter(item => item.Ferie === true).length;
  }
  
  getNormalOfficeDays(): number {
    return this.MonthlyTable.filter(item => item.Ferie === false && item.Ufficio === true).length;
  }

  getNormalTotalRolHours(): number {
    return this.MonthlyTable.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Rol, 0);
  }
}