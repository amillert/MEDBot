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
  raport: any[];
  constructor(private service: LoggerService) { }

  ngOnInit() {
    this.getLogs();
  }

  clearLogs(){ 
    this.loading = true;
    this.service.clear()
      .subscribe(logs => {
        this.getLogs();
      });
  }

  private getRaport() {
    this.loading = true;
    this.service.getRaport()
      .subscribe(raport => {
        this.raport = raport;
        this.loading = false;
        console.log(raport)
      });
  }

  private getLogs() {
    this.loading = true;
    this.service.getLogs()
      .subscribe(logs => {
        this.logs = logs;
        this.getRaport();
      });
  }
}
