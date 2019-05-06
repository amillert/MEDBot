import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  loading = false;
  logs: any[];

  constructor(private service: LoggerService) { }

  ngOnInit() {
    this.getLogs();
  }

  private getLogs() {
    this.loading = true;
    this.service.getLogs()
      .subscribe(logs => {
        this.logs = logs;
        this.loading = false;
      });
  }
}
