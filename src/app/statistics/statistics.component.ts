import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { DateTimeService, TimeTableItem } from '../date-time.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
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
  holidays$: Observable<number>     =  new Observable<number>();
  officeDays$: Observable<number>   = new Observable<number>();
 
  //-------------------------ANOTHER WAY TO DO IT-----------------------------------------------
  //officeDays:number = 0;
  //testEmitter$ = new BehaviorSubject<number>(this.officeDays);
  //--------------------------------------------------------------------------------------------

  ngOnInit(): void {
    //-----------------TEST--------------------
    this.text = this.dateTimeService.text$;

    this.text.subscribe(str =>{
      this.helloString = str;
      this.testEmitter2$.next(this.helloString);
    })
    //---------------END TEST-------------------

    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.workingHours$ = this.dateTimeService.getTotalHours();
    this.workingDays$  = this.dateTimeService.getWorkingDays();
    this.holidays$     = this.dateTimeService.getHolidays();
    this.officeDays$   = this.dateTimeService.getOfficeDays();

    //-------------------------ANOTHER WAY TO DO IT-----------------------------------------------
    // this.monthlyTable.subscribe(result => {
    //   this.officeDays = result.filter(item => item.Ferie === false && item.Ufficio === true).length;
    //   this.testEmitter$.next(this.officeDays);
    // })
    //---------------------------------------------------------------------------------------------  
  }
  
}
