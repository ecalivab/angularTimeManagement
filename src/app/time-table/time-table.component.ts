import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component } from '@angular/core';
import { DateTimeService, TimeTableItem } from '../date-time.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})

export class TimeTableComponent {
  
  //MonthlyTable:TimeTableItem[] = [];
  dataSource:any;
  selection:any;
  displayedColumns:string[] = [];

  //-------- Test of an Observable Strong ---------
  hello: string = "";
  inputChanged($event:string){
    this.dateTimeService.updateText($event);
  }
  //--------------End of Test ----------------------

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
    this.getDefaultMonthlyTable();
    this.dateTimeService.MonthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }
  
  clearTable(){
    this.dateTimeService.clear();
    this.dateTimeService.MonthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }

  nextMonth(){
    const direction = 'up';
    this.dateTimeService.getNewMonth(direction);
    this.dateTimeService.MonthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }

  previousMonth(){
   const direction = "down";
   this.dateTimeService.getNewMonth(direction);
   this.dateTimeService.MonthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  } 

  saveTable(){
    this.dateTimeService.MonthlyTable$.subscribe(result => console.log(result));
  }

}
