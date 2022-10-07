import { DatePipe } from "@angular/common";
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

    updateTimeTable(value: TimeTableItem[]): void {
        this._MonthlyTable.next(Object.assign([], value));
    }

    clear(): void {
        this._MonthlyTable.next(Object.assign([], []));
    }

    updateTimeTableOnChange(dataSource: TimeTableItem[]): void {
        //Clear Table so I don't have repeated values
        this.clear();
        //Add Complete updated table
       this.updateTimeTable(dataSource);
    }

    //* ADAPT TimeTable to Request
    timeTableRequestAdapter(item: TimeTableItem, userId: string): TimeTableRequest {
        // Acrocchio for having the same day on the API and the FrontEnd
        let syncDate = new Date(item.Date.setHours(0,0,0,0))
        syncDate.setDate(syncDate.getDate() +1)
        let adaptedRow: TimeTableRequest = {
            Date: syncDate,
            Day: item.Date.getDate(),
            Month: item.Date.getMonth()+1,
            Year: item.Date.getFullYear(),
            Hours: item.Ore,
            Rol: item.Rol,
            Holiday: item.Ferie,
            Office: item.Ufficio,
            UserId: userId,
        };
        return adaptedRow;

    }

    //* OBSERVABLE SECCION FOR STATISTICS
    getTotalHours(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Ore, 0)));
    }

    getWorkingDays(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result=> result.filter(item=> item.Ferie === false).length));
    }

    getHolidays(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result => result.filter(item => item.Ferie === true).length));
    }
    
    getOfficeDays(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result => result.filter(item => item.Ferie === false && item.Ufficio === true).length));
    }

    getTotalRolHours(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result => result.filter(item=> item.Ferie === false).reduce((sum, current) => sum+ current.Rol, 0)));
    }

    getTotalWorkingDays(): Observable<number> {
        return this.MonthlyTable$.pipe(map(result => result.length));
    }

    getMonthInTable(): Observable<Date> {
        return this.MonthlyTable$.pipe(map(res => res.length> 0 ? res[0].Date : new Date()), //Add a Control because when I clear the array it cannot read the property Date and fail.
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