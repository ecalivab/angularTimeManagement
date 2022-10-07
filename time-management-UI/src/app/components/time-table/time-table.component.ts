import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DateTimeService } from '../../services/date-time.service';
import { first, Observable, Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { TimeTableInfo, TimeTableItem, TimeTableRequest } from 'src/app/models/time-table';
import { TimeTableStore } from 'src/app/store/time-table.store';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.scss']
})

export class TimeTableComponent implements OnInit, OnDestroy {
  
  dataSource:any; //* Holds Table Source Data.
  selection:any; //* Array to get save the rows of Holidays selected.
  displayedColumns:string[] = [];
  monthlyTable$: Observable<TimeTableItem[]> = new Observable<TimeTableItem[]>();
  monthyTableSubscription$: Subscription = new Subscription();
  name: string = '';

  constructor(
    private dateTimeService: DateTimeService,
    private readonly timeTableStore: TimeTableStore,
    private authService: AuthService,
    private alertService: AlertService,
    public dialogExport: MatDialog, 
  ) {
     this.selection = new SelectionModel<TimeTableItem>(true, []);
     /* Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
     this.displayedColumns = ['Date', 'Ore','Rol','Ferie', 'Ufficio'];
  }
  
  getDefaultMonthlyTable(): void {
    let dateObj = new Date();
    let month = dateObj.getMonth(); 
    let year = dateObj.getFullYear();
    this.dateTimeService.createTable(month,year);
  }
  
  updateTable(table:TimeTableItem[]){
    this.dateTimeService.updateTableOnChange(table); 
  }

  ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    this.clearTable();
    //* We get hold of the monthlyTable$ observable. We are not doing anything with it But you can subscribe to it to get the latest list of items.
    //* Create the table passing the new dataSource  
    this.getDefaultMonthlyTable();
    this.monthlyTable$ = this.timeTableStore.MonthlyTable$;
    //* Since dataSource is subscribe ngOnInit and will detect all the changes there is no need to update the dataSource on the clearTable(), nextMonth() ...
    this.monthyTableSubscription$ = this.monthlyTable$.subscribe(result => this.dataSource = new MatTableDataSource<TimeTableItem>(result));
  }

  ngOnDestroy = (): void => {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.clearTable();
    this.monthyTableSubscription$.unsubscribe();
  }
  
  clearTable = () => {
    this.dateTimeService.clear();
  }

  nextMonth = () => {
    const direction = 'up';
    this.dateTimeService.getNewMonth(direction);
  }

  previousMonth = () => {
   const direction = "down";
   this.dateTimeService.getNewMonth(direction);
  } 

  saveTable = () => {
    let cleanTable: TimeTableRequest[] = [];
    const userId = this.authService.getCurrentUserLocalStore().id
   
    this.monthlyTable$.subscribe(currentTable => { 
      currentTable.forEach(row => {
        // I checked if it is the default case, if it is I will not save it on the database.
        if(!(row.Ore == 8 && row.Rol == 0 && row.Ferie == false && row.Ufficio == true)) 
        {
          if(row.Ferie == true)
          {
            row.Ore = 0, row.Rol = 0, row.Ufficio = false
          }
          
          cleanTable.push(this.timeTableStore.timeTableRequestAdapter(row,userId));
        }
      });
    });

    this.dateTimeService.saveTable(cleanTable)
    .pipe(first())
    .subscribe({
      next: () => {
        this.alertService.success('Table Save Succesfull')
      },
      error: error => {
        this.alertService.error(error);
      }
    });
  }

  // *EXPORT TABLE SECTION
  // Need to first convert to Array so it will be compatible with Material table :(
  
  getFileName = (name: string) => {
    let timeSpan = new Date().toISOString();
    let sheetName = name || "ExportResult";
    let fileName = `${sheetName}-${timeSpan}`;
    return {
      sheetName,
      fileName
    };
  };

  exportMaterialTable = (name: string) => {
    let { sheetName, fileName } = this.getFileName(name);
    // Get Current Table Data from the Observable.
    let dataTable: TimeTableItem[] = []
    this.monthlyTable$.subscribe(result => dataTable = result);
    let dataTableMapped = dataTable.map(x => ({
      Risorsa: name,
      Date: x.Date,
      Ore:  x.Ferie ? '' : x.Ore,
      Rol:  x.Rol ? x.Rol: '',
      Ferie: x.Ferie ? '1': '',
      Ufficio: x.Ferie ? '' : x.Ufficio ? 1: '' // If is holiday it should not sum the office hours. First control on holiday, second on Office
    }))

    let totRow: any = {
      Risorsa: 'Total:',
      Date: '',
      Ore: this.dateTimeService.getNormalWorkingDays(),
      Rol: this.dateTimeService.getNormalTotalRolHours(),
      Ferie: this.dateTimeService.getNormalHolidays(),
      Ufficio:this.dateTimeService.getNormalOfficeDays()
    }

    dataTableMapped.push(totRow)

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(dataTableMapped);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);

  }

  // -------------Dialogs---------------------------
  openExportDialog() {
    const dialogRef = this.dialogExport.open(DialogExportContent, {
      data: { 
        name: ''
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.name = result;
      if(result.length > 2){
        this.exportMaterialTable(result)
      }
    });
  }

}

@Component({
  selector: 'dialog-export',
  templateUrl: '../../dialogs/dialog-export.html',
})
export class DialogExportContent {
  constructor(
    public dialogRef: MatDialogRef<DialogExportContent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
