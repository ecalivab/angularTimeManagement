import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Holiday, HOLIDAYS, TimeTableInfo, TimeTableItem, TimeTableRequest } from '../models/time-table';
import { TimeTableStore } from '../store/time-table.store';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DateTimeService {
  // -------- Test of an Observable Strong ---------
  private _text: BehaviorSubject<string> = new BehaviorSubject('');
  text$:Observable<string> = this._text.asObservable();
  
  updateText = (hello:string) => {
    this._text.next(hello);
    this.text$ = this._text;
  }
  //--------------End of Test ----------------------

  constructor(
    private readonly timeTableStore: TimeTableStore,
    private authService: AuthService,
    private readonly httpClient: HttpClient) { }
  

  holidays = HOLIDAYS
  gHolidays:Holiday[] = [];
  //* The MonthlyTable will store the TimeTable rows in memory.
  private MonthlyTable: TimeTableItem[] = [];
  readonly MonthlyTable$: Observable<TimeTableItem[]> = this.timeTableStore.MonthlyTable$;

  //--------------- API CALLS-----------------------
  readonly url: string = environment.apiURL
  readonly httpOptions: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' })
  }

  getTable(info: TimeTableInfo): Observable<TimeTableItem[]> {
     return this.httpClient.get<TimeTableItem[]>(`${this.url}/TimeTable/get/${info.UserId}/${info.Month}/${info.Year}`).pipe(catchError(this.handleHttpError), shareReplay())
   }

  saveTable(table: TimeTableRequest[]) : Observable<any> {
    return this.httpClient.post(`${this.url}/TimeTable/save`, table).pipe(catchError(this.handleHttpError))
  }

  deleteTable(info: TimeTableInfo) : Observable<any> {
    return this.httpClient
    .delete(`${this.url}/TimeTable/delete/${info.UserId}/${info.Month}/${info.Year}`)
    .pipe(catchError(this.handleHttpError))
  }

   // Error
  handleHttpError = (error: HttpErrorResponse) => {
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


  isHoliday = (itemDate: Date): Boolean => {
    return this.holidays.some(h => h.Date.getTime() == itemDate.getTime())
  }

   checkUserRow = (dbArray:TimeTableItem[], item: TimeTableItem): TimeTableItem =>  {
    let tmpFnd: TimeTableItem = new TimeTableItem();
    let index: number = -1;
    if(dbArray.length > 0) {
      index = dbArray.findIndex(row => new Date(row.date).toISOString() === item.date.toISOString())!
      if(index > -1)
      {
        //* I remove the entry of the array since I don't need it anymore so the next find works with less data. 
        tmpFnd = dbArray[index]
        dbArray.splice(index, 1);
        return tmpFnd;
      } 
    }
    return item;         
  }

  createTable = (month: number, year: number, userRows: TimeTableItem[]): void => {
    var date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      var item:TimeTableItem = {
        date: new Date(date.setHours(0,0,0,0)),
        hours: 8,
        rol:0,
        holiday: false,
        office: true, 
      }
      if(item.date.getDay() !== 0 && item.date.getDay() !== 6) {
         if(!this.isHoliday(item.date)) {
          this.MonthlyTable.push(this.checkUserRow(userRows, item))
         }        
      }
      date.setDate(date.getDate() + 1);
    }
    this.timeTableStore.updateTimeTable(this.MonthlyTable)
    return;
  }

  prepareTable = (month: number, year: number): void => {
    if(this.authService.isUserLogged()) {
      var info: TimeTableInfo = 
      {
        UserId: this.authService.getCurrentUserLocalStore().id,
        Month: month+1,
        Year: year
      }
      this.getTable(info).subscribe(val => {
         this.createTable(month, year, val);
      });
      return;
    }
    this.createTable(month, year, []);
  }

  clear = () => {
    this.MonthlyTable = [];
    this.timeTableStore.clear();
  }

  updateTableOnChange = (dataSource: TimeTableItem[]) => {
    this.timeTableStore.updateTimeTableOnChange(dataSource);
  }

  getNewMonth = (direction: string): void => {
      const data = this.MonthlyTable.length > 0 ? {'currentMonth': new Date(this.MonthlyTable[0].date).getMonth(), 'currentYear': new Date(this.MonthlyTable[0].date).getFullYear()} : {'currentMonth':-10, 'currentYear':-10};
      if(data.currentMonth == -10) {
        alert("Something Wrong Happend!!!");
        return;
      }
      const newMonth = direction == 'up' ? data.currentMonth + 1 : data.currentMonth -1;
      const checkedData = this.checkNewYear(newMonth,data.currentYear);
      this.clear();
      this.prepareTable(checkedData.month,checkedData.year);    
  }

  checkNewYear = (month: number, year: number): any => {
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

  getRemaindingWorkDays = (): number => {
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

  getCurrentMonthTotalWorkDays = (): number => {
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

//* OBSERVABLE SECCION FOR STATISTICS
    getTotalHours = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.holiday === false).reduce((sum, current) => sum+ current.hours, 0)));
    }

    getWorkingDays = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result=> result.filter(item=> item.holiday === false).length));
    }

    getHolidays = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result => result.filter(item => item.holiday === true).length));
    }
    
    getOfficeDays = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result => result.filter(item => item.holiday === false && item.office === true).length));
    }

    getTotalRolHours = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.holiday === false).reduce((sum, current) => sum+ current.rol, 0)));
    }

    getTotalWorkingDays = (): Observable<number> => {
        return this.MonthlyTable$.pipe(map(result => result.length));
    }

    getMonthInTable = (): Observable<Date> => {
        return this.MonthlyTable$.pipe(map(res => res.length> 0 ? res[0].date : new Date()), //Add a Control because when I clear the array it cannot read the property Date and fail.
        catchError(this.handleError<any>('new Date()'))
        );
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
    
  //* SECTION FOR XLS return normal values

  getNormalWorkingDays = (): number => {
    return this.MonthlyTable.filter(item=> item.holiday === false).length;
  }

  getNormalHolidays = (): number => {
    return this.MonthlyTable.filter(item => item.holiday === true).length;
  }
  
  getNormalOfficeDays = (): number => {
    return this.MonthlyTable.filter(item => item.holiday === false && item.office === true).length;
  }

  getNormalTotalRolHours = (): number => {
    return this.MonthlyTable.filter(item=> item.holiday === false).reduce((sum, current) => sum+ current.rol, 0);
  }
}