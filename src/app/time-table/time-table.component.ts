import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component } from '@angular/core';
import { DateTimeService, TimeTableItem } from '../date-time.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})

export class TimeTableComponent {
  
  MonthlyTable:TimeTableItem[] = [];
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
    this.MonthlyTable = this.dateTimeService.createTable(month,year);
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.getDefaultMonthlyTable();
    this.dataSource = new MatTableDataSource<TimeTableItem>(this.MonthlyTable);
  }

}
