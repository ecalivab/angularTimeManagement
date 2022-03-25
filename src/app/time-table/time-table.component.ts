import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component } from '@angular/core';
import { DateTimeService, TimeTableItem } from '../date-time.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})

export class TimeTableComponent {
  
  dataSource:any; //*Holds Table Source Data.
  selection:any; //*Array to get save the rows of Holidays selected.
  displayedColumns:string[] = [];
  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();

  constructor(
    private dateTimeService: DateTimeService,
  ) {
     this.selection = new SelectionModel<TimeTableItem>(true, []);
     /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
     this.displayedColumns = ['Date', 'Ore','Rol','Ferie', 'Ufficio'];
  }
  
  getDefaultMonthlyTable(): void {
    let dateObj = new Date();
    let month = dateObj.getMonth(); 
    let year = dateObj.getFullYear();
    this.dateTimeService.createTable(month,year);
  }
  
  updateTable(table:TimeTableItem[]){
    this.dateTimeService.updateTable(table); 
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //*We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of Todo items.
    this.monthlyTable$ = this.dateTimeService.MonthlyTable$;
    this.getDefaultMonthlyTable();
    //*Create the table passing the new dataSource
    //*Since dataSource is subscribe ngOnInit and will detect all the changes there is no need to update the dataSource on the clearTable(), nextMonth() ...
    this.monthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }
  
  clearTable(){
    this.dateTimeService.clear();
  }

  nextMonth(){
    const direction = 'up';
    this.dateTimeService.getNewMonth(direction);
  }

  previousMonth(){
   const direction = "down";
   this.dateTimeService.getNewMonth(direction);
  } 

  saveTable(){
    this.monthlyTable$.subscribe(result => console.log(result));
  }

}
