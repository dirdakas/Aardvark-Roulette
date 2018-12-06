import { Observable, Subject, BehaviorSubject, EMPTY } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LogsService } from 'src/app/services/logs.service';
import { Injectable } from '@angular/core';
import { take, tap, catchError } from 'rxjs/operators';

export interface IGameResponse {
  duration: number;
  fakeStartDelta: number;
  id: number;
  outcome: string;
  result: number;
  startDelta: number;
  startDeltaUs: number;
  startTime: string;
  uuid: string;
}

export interface IStats {
  result: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  static NEXT_GAME_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/nextGame';
  static GET_GAME_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/game'; // :gameId
  static GET_STATS_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/stats'; // limit
  static LIMIT = 200;

  private isLoadingSubject: Subject<boolean> = new Subject();
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private gameEventsSubject: BehaviorSubject<IGameResponse[]> = new BehaviorSubject<IGameResponse[]>([]);
  gameEvents$: Observable<IGameResponse[]> = this.gameEventsSubject.asObservable();

  private gameStatsSubject: BehaviorSubject<IStats[]> = new BehaviorSubject<IStats[]>([]);
  gameStats$: Observable<IStats[]> = this.gameStatsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logsService: LogsService
  ) { }

  checkForNewGame(): Observable<IGameResponse> {
    this.logsService.updateLogs('Checking for new game');

    return this.checkForGame();
  }

  checkForGame(): Observable<IGameResponse> {
    this.logsService.updateLogs('Get .../nextGame');

    return this.http.get<IGameResponse>(GameService.NEXT_GAME_URL);
  }

  getGameById(id: number): Observable<IGameResponse> {
    this.logsService.updateLogs('Get .../game/' + id);

    return this.http.get<IGameResponse>(`${GameService.GET_GAME_URL}/${id}`);
  }

  changeGameStatusIsLoading(): void {
    this.isLoadingSubject.next(true);
  }

  changeGameStatusLoaded(): void {
    this.isLoadingSubject.next(false);
  }

  addNewGameEvent(newEvent: IGameResponse): void {
    const currentEvents: IGameResponse[] = this.gameEventsSubject.getValue();
    currentEvents.push(newEvent);
    this.gameEventsSubject.next(currentEvents);
  }

  updateEvent(newEvent: IGameResponse): void {
    const currentEvents: IGameResponse[] = this.gameEventsSubject.getValue();
    const index = currentEvents.findIndex((ev: IGameResponse) => ev.id === newEvent.id);
    if (index >= 0) {
      currentEvents[index] = newEvent;
      this.gameEventsSubject.next(currentEvents);
    }
  }

  getStatsForLastGames(): Observable<IStats[]> {
    return this.http.get<IStats[]>(GameService.GET_STATS_URL, {
      params: new HttpParams()
        .set('limit', GameService.LIMIT.toString())
    });
  }

  updateStats(): void {
    this.getStatsForLastGames()
      .pipe(
        take(1),
        tap((stats: IStats[]) => this.gameStatsSubject.next(stats)),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }
}
