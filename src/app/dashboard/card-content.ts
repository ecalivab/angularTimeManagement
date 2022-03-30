import { DateTimeService } from '../date-time.service';

export interface CardContent {
  Title:string;
  Color:string;
  Icon:string;
  Content:string;
}

var dateService = new DateTimeService();

var remaindingWD = dateService.getRemaindingWorkDays();
var totalWD = dateService.getCurrentMonthTotalWorkDays();
var monthHolidays = dateService.gHolidays;

var numberMonthHolidays = monthHolidays.length;


export const CARDS: CardContent[] = [
  {Title:'Remainding Work Days', Icon:'work' , Color:'icon-blue', Content:`<p>${remaindingWD}</p>`},
  {Title:'Total Work Days', Icon:'work' , Color:'icon-orange', Content:`<p>${totalWD}</p>` },
  {Title:'Holidays', Icon:'nature_people' , Color:'icon-green', Content:`<p> ${numberMonthHolidays}</p>`},
  //{Title:'Surprise', Icon:'youtube_searched_for' , Color:'icon-red', Content:"<input matInput type='text' [(ngModel)]='hello' (ngModelChange)='inputChanged($event)' placeholder='Said Ciao' name='hello'>" },
];