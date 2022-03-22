import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DateTimeService,TimeTableItem} from '../date-time.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  constructor(private dateTimeService: DateTimeService) {}

  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  currentMonth$: Observable<Date> = new Observable<Date>();

  ngOnInit(): void {
    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    //this.currentMonth$ = this.dateTimeService.getCurrentMonth();
  }

}
