import { Component } from '@angular/core';
import { DateTimeService } from '../date-time.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private dateTimeService: DateTimeService) {}

}
