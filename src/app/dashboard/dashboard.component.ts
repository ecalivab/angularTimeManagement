import { Component, Inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { DateTimeService,TimeTableItem , Holiday} from '../date-time.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CARDS } from './card-content';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit{

  constructor(private dateTimeService: DateTimeService, 
    private breakpointObserver: BreakpointObserver,
    public dialogHoliday: MatDialog, 
    public dialogVideo: MatDialog, 
    public sanitizer:DomSanitizer,) {
      this.dateTimeService.getCurrentMonthTotalWorkDays();
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/watch?v=o-YBDTqX_ZU&ab_channel=MusRest');
    }

  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  monthInTable$: Observable<Date> = new Observable<Date>();
  readonly cards = CARDS;
  url:SafeResourceUrl;

  isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  //-------- Test of an Observable Strong ---------
  hello: string = "";
  inputChanged($event:string){
    this.dateTimeService.updateText($event);
    if($event == 'Ciao Capozzi'){
      this.openVideoDialog();
    }
  }
  //--------------End of Test ----------------------

  //-------------Dialogs---------------------------
  openHolidayDialog() {
    const dialogRef = this.dialogHoliday.open(DialogHolidyaContent, {
      data: { 
        days: this.dateTimeService.gHolidays
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  openVideoDialog(){
    const dialogRef = this.dialogHoliday.open(DialogVideoContent, {
      data: {
        URL: this.url
      }
    
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  //-----------Enf of Dialogs------------------------
  cardFunction(num:number) {
    switch(num){
      case 3:
        this.openHolidayDialog();
        break;
      default:
        break;

    }
  }

  ngOnInit(): void {
    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.monthInTable$ = this.dateTimeService.getMonthInTable();
  }
}

@Component({
  selector: 'dialog-holiday',
  templateUrl: 'dialogs/dialog-holiday.html',
})
export class DialogHolidyaContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}


@Component({
  selector: 'dialog-video',
  templateUrl: 'dialogs/dialog-video.html',
})
export class DialogVideoContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}