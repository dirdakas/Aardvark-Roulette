import { LogsService } from './logs.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, BehaviorSubject } from 'rxjs';
import { take, tap, catchError } from 'rxjs/operators';

export interface ISlot {
  color: string;
  positionToId: number;
  result: string;
}

export interface IGameConfig {
  name: string;
  slots: ISlot[];
}

interface IConfigResponse {
  name: string;
  colors: string[];
  positionToId: number[];
  results: string[];
  slots: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  static CONFIG_URL = 'https://dev-games-backend.advbet.com/v1/ab-roulette/1/configuration';

  private confSubject: BehaviorSubject<IGameConfig> = new BehaviorSubject(null);
  conf$: Observable<IGameConfig> = this.confSubject.asObservable();

  constructor(
    private http: HttpClient,
    private logsService: LogsService
  ) {}

  loadConfig(): void {
    this.getConfig()
      .pipe(
        take(1),
        tap((response: IConfigResponse) => {
          const newConf: IGameConfig = {
            name: response.name,
            slots: this.getSlots(response)
          };

          this.updateConfig(newConf);
        }),
        catchError(_err => EMPTY)
      )
      .subscribe();
  }

  getConfig(): Observable<IConfigResponse> {
    this.logsService.updateLogs('GET .../configuration');

    return this.http.get<IConfigResponse>(ConfigurationService.CONFIG_URL);
  }

  updateConfig(data: IGameConfig): void {
    this.confSubject.next(data);
  }

  private getSlots(data: IConfigResponse): ISlot[] {
    const result: ISlot[] = [];
    for (let i = 0; i < data.slots; i++) {
      const slot: ISlot = {
        color: data.colors[i],
        positionToId: data.positionToId[i],
        result: data.results[i]
      };
      result.push(slot);
    }

    return result;
  }
}
