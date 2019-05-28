import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  loading = false;
  p: number = 1;
  logs: any[];
  raport: any[];
  constructor(private service: LoggerService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.getLogs();
  }

  clearLogs() {
    this.loading = true;
    this.service.clear()
      .subscribe(logs => {
        this.getLogs();
        this.toastrService.success("Logs cleared");
      });
    this.loading = false;
  }

  private getRaport() {
    this.loading = true;
    this.service.getRaport()
      .subscribe(raport => {
        this.raport = raport;
        this.loading = false;
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
