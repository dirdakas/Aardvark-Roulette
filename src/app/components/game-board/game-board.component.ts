import { GameService, IGameResponse } from './../../services/game.service';
import { IGameConfig } from './../../services/configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.sass']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameBoard$: Observable<IGameConfig>;
  isLoading$: Observable<boolean>;
  outcome: number;

  private gameEvents: Subscription;

  constructor(
    private logsService: LogsService,
    private configurationService: ConfigurationService,
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.logsService.updateLogs('Loading game board');
    this.configurationService.loadConfig();

    this.gameBoard$ = this.configurationService.conf$
      .pipe();

    this.isLoading$ = this.gameService.isLoading$
      .pipe();

    this.gameEvents = this.gameService.gameEvents$
      .pipe(
        tap((gameEvents: IGameResponse[]) => {
          this.showLastNumber(gameEvents);
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

  private showLastNumber(gameEvents: IGameResponse[]): void {
    if (gameEvents.length > 1) {
      this.outcome = Number(gameEvents[gameEvents.length - 2].outcome);
      setTimeout(() => {
        this.outcome = null;
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    this.gameEvents.unsubscribe();
  }
}
