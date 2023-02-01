import { Component, Inject, OnInit } from '@angular/core';
import { map, Observable, shareReplay, Subscription } from 'rxjs';
import { DateTimeService } from '../../services/date-time.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CardContent } from './card-content';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor(private dateTimeService: DateTimeService, 
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    public dialogHoliday: MatDialog, 
    public dialogVideo: MatDialog,
    ) { }

  monthInTable$: Observable<Date> = new Observable<Date>();

  userLogged$:  Observable<boolean> = this.authService.userLogged$;
  isUserLogged: boolean = false;

  columns:number = 4;
  componentCols:number = 2;

  // CARD Section 
  // It was a good idea at first but the cards make absolutely nothing
   remaindingWD = this.dateTimeService.getRemaindingWorkDays();
   totalWD = this.dateTimeService.getCurrentMonthTotalWorkDays();
   monthHolidays = this.dateTimeService.gHolidays;
   numberMonthHolidays = this.monthHolidays.length;

  CARDS: CardContent[] = [
    {Title:'Remainding Work Days', Icon:'work' , Color:'icon-blue', Content:`<p>${this.remaindingWD}</p>`, FuncNumber: 1},
    {Title:'Total Work Days', Icon:'work' , Color:'icon-orange', Content:`<p>${this.totalWD}</p>`, FuncNumber:2},
    {Title:'Holidays', Icon:'nature_people' , Color:'icon-green', Content:`<p> ${this.numberMonthHolidays}</p>`, FuncNumber:3},
    //{Title:'Surprise', Icon:'youtube_searched_for' , Color:'icon-red', Content:"<input matInput type='text' [(ngModel)]='hello' (ngModelChange)='inputChanged($event)' placeholder='Said Ciao' name='hello'>" },
  ];

  readonly cards = this.CARDS;

  isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // -------- Test of an Observable Strong ---------

  // hello: string = "";
  // inputChanged($event:string){
  //   this.dateTimeService.updateText($event);
  //   if($event.toLocaleLowerCase() == 'ciao capozzi'){
  //     this.openVideoDialog();
  //   }
  // }

  inputChangedSimplified(letter: string) {
    this.dateTimeService.updateText(letter);
    if(letter.toLocaleLowerCase() == 'ciao capozzi'){
      this.openVideoDialog();
    }
  }
  //--------------End of Test ----------------------

  //-------------Dialogs---------------------------
  openHolidayDialog() {
    const dialogRef = this.dialogHoliday.open(DialogHolidayContent, {
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
        URL: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
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
    //*We get hold of the monthlyTable$ observable. We are not doing anyting with it But you can subscribe to it to get the latest list of Table items.
    this.monthInTable$ = this.dateTimeService.getMonthInTable();

    this.userLogged$.subscribe(val => this.isUserLogged = val)

    //*Layout resize by breakpoint size (Medium-Handset)
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Medium, Breakpoints.XSmall, Breakpoints.Large, Breakpoints.XLarge, '(min-width: 1280px) and (max-width: 1440px)']).subscribe((state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.Medium]) {
        this.componentCols = 1;
        this.columns = 2;
      }
      if(state.breakpoints[Breakpoints.XSmall] || state.breakpoints[Breakpoints.Small]) {
        this.componentCols = 1;
        this.columns = 1;
      }
      
      if(state.breakpoints[Breakpoints.Large]) {
        this.componentCols = 2;
        this.columns = 4;
      }

      if(this.breakpointObserver.isMatched('(min-width: 1280px) and (max-width: 1440px)')) {
        this.componentCols = 1;
        this.columns = 2;
      }

      if(state.breakpoints[Breakpoints.XLarge]) {
        this.componentCols = 2;
        this.columns = 4;
      }
      shareReplay();
    })
  }
}

@Component({
  selector: 'dialog-holiday',
  templateUrl: '../../dialogs/dialog-holiday.html',
})
export class DialogHolidayContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'dialog-video',
  templateUrl: '../../dialogs/dialog-video.html',
})
export class DialogVideoContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}