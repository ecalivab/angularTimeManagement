import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { DateTimeService,TimeTableItem} from '../date-time.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CARDS } from './card-content';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit{

  constructor(private dateTimeService: DateTimeService, 
    private breakpointObserver: BreakpointObserver) {}

  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  monthInTable$: Observable<Date> = new Observable<Date>();

  cards = CARDS;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  //-------- Test of an Observable Strong ---------
  hello: string = "";
  inputChanged($event:string){
    this.dateTimeService.updateText($event);
  }
  //--------------End of Test ----------------------


  ngOnInit(): void {
    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.monthInTable$ = this.dateTimeService.getMonthInTable();
  }

}
