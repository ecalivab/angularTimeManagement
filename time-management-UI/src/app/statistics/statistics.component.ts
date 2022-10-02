import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map,Observable } from 'rxjs';
import { combineLatest } from 'rxjs/operators';
import { DateTimeService, TimeTableItem } from '../services/date-time.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  helloString:string = '';
  testEmitter2$ = new BehaviorSubject<string>(this.helloString);
  text:Observable<string> = new Observable<string>();

  
  //*We inject dateTimeService
  constructor(private dateTimeService: DateTimeService) {}

  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  workingHours$: Observable<number> = new Observable<number>();
  workingDays$: Observable<number>  = new Observable<number>();
  holidays$: Observable<number>     = new Observable<number>();
  officeDays$: Observable<number>   = new Observable<number>();
  rolHours$: Observable<number>     = new Observable<number>();

  totalMonthlyWorkDays: number = this.dateTimeService.getCurrentMonthTotalWorkDays();
  totalMonthlyHours : number = this.totalMonthlyWorkDays*8;

  totalHourPercentage$: Observable<number> = new Observable<number>();
  totalWorkingDaysPercentage$: Observable<number> = new Observable<number>();
  totalOfficeDaysPercentage$: Observable<number> = new Observable<number>();
  totalHolidaysPercentage$: Observable<number> = new Observable<number>();
  // -------------------------ANOTHER WAY TO DO IT-----------------------------------------------
  // officeDays:number = 0;
  // testEmitter$ = new BehaviorSubject<number>(this.officeDays);
  // --------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // -----------------TEST--------------------
    this.text = this.dateTimeService.text$;

    this.text.subscribe(str =>{
      this.helloString = str;
      this.testEmitter2$.next(this.helloString);
    })
    // ---------------END TEST-------------------

    //* We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.workingDays$  = this.dateTimeService.getWorkingDays();
    this.holidays$     = this.dateTimeService.getHolidays();
    this.officeDays$   = this.dateTimeService.getOfficeDays();
    this.rolHours$     = this.dateTimeService.getTotalRolHours();
    this.workingHours$ = this.dateTimeService.getTotalHours().pipe(combineLatest(this.rolHours$),map(([n1,n2]) =>  Math.abs(n1 - n2)));

    this.totalHourPercentage$ = this.workingHours$.pipe(map(result => (result/this.totalMonthlyHours)*100));
    this.totalWorkingDaysPercentage$ = this.workingDays$.pipe(map(result => (result/this.totalMonthlyWorkDays)*100));
    this.totalOfficeDaysPercentage$ = this.officeDays$.pipe(map(result => (result/this.totalMonthlyWorkDays)*100));
    this.totalHolidaysPercentage$   = this.holidays$.pipe(map(result => (result/this.totalMonthlyWorkDays)*100));
    // -------------------------ANOTHER WAY TO DO IT-----------------------------------------------
    // this.monthlyTable.subscribe(result => {
    //   this.officeDays = result.filter(item => item.Ferie === false && item.Ufficio === true).length;
    //   this.testEmitter$.next(this.officeDays);
    // })
    // ---------------------------------------------------------------------------------------------  
  }
  
}
