import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DateTimeService,TimeTableItem} from '../date-time.service';
import { CARDS } from './card-content';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit{

  constructor(private dateTimeService: DateTimeService) {}

  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  currentMonth$: Observable<Date> = new Observable<Date>();

  cards = CARDS;

  //-------- Test of an Observable Strong ---------
  hello: string = "";
  inputChanged($event:string){
    this.dateTimeService.updateText($event);
  }
  //--------------End of Test ----------------------


  ngOnInit(): void {
    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.currentMonth$ = this.dateTimeService.getCurrentMonth();
  }

}
