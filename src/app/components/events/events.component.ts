import { GameService, IGameResponse } from './../../services/game.service';
import { LogsService } from 'src/app/services/logs.service';
import { Component, OnInit } from '@angular/core';
import { take, tap, catchError, debounceTime } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.sass']
})
export class EventsComponent implements OnInit {
  isTimerVisible: boolean;
  countdown: number;
  gameEvents$: Observable<IGameResponse[]>;

  constructor(
    private logsService: LogsService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.gameEvents$ = this.gameService.gameEvents$
      .pipe();

    this.checkForNewGame();
  }

  checkForNewGame(): void {
    this.gameService.checkForNewGame()
      .pipe(
        take(1),
        tap((nextGame: IGameResponse) => {
          this.gameService.addNewGameEvent(nextGame);
          this.countdown = nextGame.fakeStartDelta;
          this.logsService.updateLogs(`sleeping for fakeStartDelta ${nextGame.fakeStartDelta} sec`);
          this.setTimer(this.countdown, nextGame.id);
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

  setTimer(time: number, id: number): void {
    if (time) {
      this.isTimerVisible = true;
      setTimeout(() => {
        this.countdown--;
        this.setTimer(this.countdown, id);
      }, 1000);
    } else {
      this.isTimerVisible = false;
      this.gameService.changeGameStatusIsLoading();
      this.getGameResultById(id);
    }
  }

  getGameResultById(id: number): void {
    this.logsService.updateLogs('Spinning the wheel');
    this.gameService.getGameById(id)
      .pipe(
        debounceTime(300),
        take(1),
        tap((res: IGameResponse) => {
          if (res.outcome) {
            console.log('res', res);
            this.logsService.updateLogs(`Result is ${res.outcome}`);
            this.gameService.updateEvent(res);
            this.gameService.changeGameStatusLoaded();
            this.checkForNewGame();
          } else {
            this.logsService.updateLogs('Still no result continue spinning');
            setTimeout(() => {
              this.getGameResultById(id);
            }, 300);
          }
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

}
