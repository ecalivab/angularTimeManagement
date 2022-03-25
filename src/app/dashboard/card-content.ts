export interface CardContent {
  Title:string;
  Color:string;
  Icon:string;
  Content:string;
}


export const CARDS: CardContent[] = [
  {Title:'Remainding Work Days', Icon:'work' , Color:'icon-blue', Content:"<h1>Mmm...</h1>" },
  {Title:'Total Work Days', Icon:'work' , Color:'icon-orange', Content:"" },
  {Title:'Holidays', Icon:'nature_people' , Color:'icon-green', Content:"<p>Is this working?</p>" },
  //{Title:'Surprise', Icon:'youtube_searched_for' , Color:'icon-red', Content:"<input matInput type='text' [(ngModel)]='hello' (ngModelChange)='inputChanged($event)' placeholder='Said Ciao' name='hello'>" },
];