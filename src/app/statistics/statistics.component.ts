import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DateTimeService } from '../date-time.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private dateTimeService: DateTimeService) { }
 
  workingHours$: Observable<number> = new Observable<number>();
  workingDays$: Observable<number>  = new Observable<number>();
  holidays$: Observable<number>     =  new Observable<number>();
  officeDays$: Observable<number>   = new Observable<number>();

  ngOnInit(): void {
    this.workingHours$ = this.dateTimeService.getTotalHours();
    this.workingDays$  = this.dateTimeService.getWorkingDays();
    this.holidays$     = this.dateTimeService.getHolidays();
    this.officeDays$   = this.dateTimeService.getOfficeDays(); 
  } 
}
