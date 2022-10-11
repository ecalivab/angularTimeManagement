import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of } from "rxjs";
import { TimeTableItem, TimeTableRequest } from "../models/time-table";


@Injectable({
  providedIn: 'root'
})

export abstract class TimeTableStore {
    
    //* Here, we create BehaviorSubject of type TimeTableItem[]. Behavior expects us to provide an initial value. We assign an empty array. The BehaviorSubject will always emit the latest list of TimeTableItem items as an array.
    private readonly _MonthlyTable: BehaviorSubject<any> = new BehaviorSubject([]);
    //* Also, it is advisable not to expose the BehaviorSubject outside the service. Hence we convert it to normal Observable and return it. This is because the methods like next, complete or error do not exist on normal observable.
    readonly MonthlyTable$: Observable<TimeTableItem[]> = this._MonthlyTable.asObservable();

    //* Refresh the values of the Table
    updateTimeTable = (value: TimeTableItem[]): void => {
        this._MonthlyTable.next(Object.assign([], value));
    }

    clear = (): void => {
        this._MonthlyTable.next(Object.assign([], []));
    }

    updateTimeTableOnChange(dataSource: TimeTableItem[]): void {
        //Clear Table so I don't have repeated values
        this.clear();
        //Add Complete updated table
        this.updateTimeTable(dataSource);
    }

    //* ADAPT TimeTable to Request
    timeTableRequestAdapter = (item: TimeTableItem, userId: string): TimeTableRequest => {
        let itemDate = new Date(item.date)
        // Acrocchio for having the same day on the API and the FrontEnd
        let syncDate = new Date(itemDate.setHours(0,0,0,0))
        // The frameworks converts to ISO string format to send it throught json format in UTC time  
        syncDate.setDate(syncDate.getDate() +1)
        let adaptedRow: TimeTableRequest = {
            Date: syncDate,
            Day: itemDate.getDate(),
            Month: itemDate.getMonth()+1,
            Year: itemDate.getFullYear(),
            Hours: item.hours,
            Rol: item.rol,
            Holiday: item.holiday,
            Office: item.office,
            UserId: userId,
        };
        return adaptedRow;
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
}