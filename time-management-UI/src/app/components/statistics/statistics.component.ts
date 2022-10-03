import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest ,map,Observable } from 'rxjs';
import { DateTimeService, TimeTableItem } from '../../services/date-time.service';

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

  totalMonthlyWorkDays$: Observable<number> = this.dateTimeService.getTotalWorkingDays();
 
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
    
    this.workingHours$ = combineLatest([this.rolHours$, this.dateTimeService.getTotalHours()]).pipe(map(([rol,hour]) => Math.abs(rol-hour)));

    this.totalHourPercentage$ = combineLatest([this.workingHours$, this.totalMonthlyWorkDays$]).pipe(map(([wh,mwd]) => (wh/(mwd*8))*100));
    this.totalWorkingDaysPercentage$ = combineLatest([ this.workingDays$, this.totalMonthlyWorkDays$]).pipe(map(([wd,mwd]) => (wd/(mwd))*100));
    this.totalOfficeDaysPercentage$ = combineLatest([ this.officeDays$, this.totalMonthlyWorkDays$]).pipe(map(([od,mwd]) => (od/(mwd))*100));
    this.totalHolidaysPercentage$   = combineLatest([ this.holidays$, this.totalMonthlyWorkDays$]).pipe(map(([hd,mwd]) => (hd/(mwd))*100));

    // -------------------------ANOTHER WAY TO DO IT-----------------------------------------------
    // this.monthlyTable.subscribe(result => {
    //   this.officeDays = result.filter(item => item.Ferie === false && item.Ufficio === true).length;
    //   this.testEmitter$.next(this.officeDays);
    // })
    // ---------------------------------------------------------------------------------------------  
  }
  
}
