import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { GameService, IGameResponse } from './../../services/game.service';
import { LogsService } from './../../services/logs.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';
import SpyObj = jasmine.SpyObj;

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let logsService: SpyObj<LogsService>;
  let gameService: SpyObj<GameService>;

  beforeEach(async(() => {
    const gameEventsSubject: BehaviorSubject<IGameResponse[]> = new BehaviorSubject<IGameResponse[]>([]);
    const gameEvents$: Observable<IGameResponse[]> = gameEventsSubject.asObservable();

    const MOCK_GAME_SERVICE = {
      gameEventsSubject,
      gameEvents$,
      checkForNewGame: (): Observable<IGameResponse> => of(),
      addNewGameEvent: (newEvent: IGameResponse): void => {},
      changeGameStatusIsLoading: (): void => {},
      getGameById: (id: number) => {},
      updateEvent: (newEvent: IGameResponse) => {},
      changeGameStatusLoaded: () => {},
      updateStats: () => {},
    };

    TestBed.configureTestingModule({
      declarations: [ EventsComponent ],
      providers: [
        {
          provide: LogsService,
          useValue: jasmine.createSpyObj('LogsService', [
            'updateLogs',
          ]),
        },
        {
          provide: GameService,
          useValue: MOCK_GAME_SERVICE,
        },
      ]
    })
    .compileComponents();

    logsService = TestBed.get(LogsService);
    gameService = TestBed.get(GameService);

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    spyOn(gameService, 'checkForNewGame').and
      .returnValue(throwError({}));
    expect(component)
      .toBeTruthy();
  });
});
