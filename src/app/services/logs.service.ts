import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private logsSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);
  logs$: Observable<string[]> = this.logsSubject.asObservable();

  updateLogs(message: string): void {
    const fullMessage: string = new Date().toISOString() + ' ' + message;
    const currentMsgs = this.logsSubject.getValue();
    currentMsgs.push(fullMessage);
    this.logsSubject.next(currentMsgs);
  }
}
