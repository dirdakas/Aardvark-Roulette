import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.sass']
})
export class LogComponent implements OnInit {
  logs$: Observable<string[]>;
  constructor(private logsService: LogsService) { }

  ngOnInit() {
    this.logs$ = this.logsService.logs$
      .pipe();
  }
}
