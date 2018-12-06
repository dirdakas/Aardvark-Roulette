import { ConfigurationService, IGameConfig, ISlot } from './../../services/configuration.service';
import { Observable } from 'rxjs';
import { GameService, IStats } from './../../services/game.service';
import { Component, OnInit } from '@angular/core';
import { tap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.sass']
})
export class StatsComponent implements OnInit {
  stats$: Observable<IStats[]>;
  limit: number;
  conf: IGameConfig;

  constructor(
    private configurationService: ConfigurationService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.limit = GameService.LIMIT;
    this.gameService.updateStats();
    this.stats$ = this.gameService.gameStats$
      .pipe();

    this.configurationService.conf$
      .pipe(
        filter((conf: IGameConfig) => conf !== null),
        tap((conf: IGameConfig) => this.conf = conf)
      )
      .subscribe();
  }

  getClassByValue(value: number): string {
    if (this.conf) {
      return this.conf.slots.find((slot: ISlot) => slot.positionToId === value).color;
    }
  }
}
