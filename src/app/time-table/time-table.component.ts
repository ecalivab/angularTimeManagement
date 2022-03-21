import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component } from '@angular/core';
import { DateTimeService, TimeTableItem } from '../date-time.service';
import { Observable } from 'rxjs';
import { catchError, map, tap, isEmpty } from 'rxjs/operators';

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
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.getDefaultMonthlyTable();
    this.dateTimeService.MonthlyTable.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }
  
  clearTable(){
    this.dateTimeService.clear();
    this.dateTimeService.MonthlyTable.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }

  nextMonth(){
    const currentDate = this.dateTimeService.getCurrentMonthYear();
    if(currentDate.currentMonth != -10) { //No Error
      this.dateTimeService.clear();
      const checkedDate = this.dateTimeService.checkNewYear(Number(currentDate.currentMonth) + 1, Number(currentDate.currentYear));
      this.dateTimeService.createTable(checkedDate.month, checkedDate.year);
      this.dateTimeService.MonthlyTable.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
    }
    else{
      alert("Something Wrong Happend!");
    }
  }

  previousMonth(){
    const currentDate = this.dateTimeService.getCurrentMonthYear();
    if(currentDate.currentMonth != -10) { //No Error
      this.dateTimeService.clear();
      const checkedDate = this.dateTimeService.checkNewYear(Number(currentDate.currentMonth)-1, Number(currentDate.currentYear));
      this.dateTimeService.createTable(checkedDate.month, checkedDate.year);
      this.dateTimeService.MonthlyTable.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
    }
    else{
      alert("Something Wrong Happend!");
    }
  }

  saveTable(){
    this.dateTimeService.MonthlyTable.subscribe(result => console.log(result));
  }

}
