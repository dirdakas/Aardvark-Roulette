import { ConfigurationService } from 'src/app/services/configuration.service';
import { IGameConfig } from './../../services/configuration.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GameService, IGameResponse } from './../../services/game.service';
import { LogsService } from './../../services/logs.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import SpyObj = jasmine.SpyObj;

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  let logsService: SpyObj<LogsService>;
  let gameService: SpyObj<GameService>;
  let configurationService: SpyObj<ConfigurationService>;

  beforeEach(async(() => {
    const gameEventsSubject: BehaviorSubject<IGameResponse[]> = new BehaviorSubject<IGameResponse[]>([]);
    const gameEvents$: Observable<IGameResponse[]> = gameEventsSubject.asObservable();
    const isLoadingSubject: Subject<boolean> = new Subject();
    const isLoading$: Observable<boolean> = isLoadingSubject.asObservable();
    const confSubject: BehaviorSubject<IGameConfig> = new BehaviorSubject<IGameConfig>(null);
    const conf$: Observable<IGameConfig> = confSubject.asObservable();

    const MOCK_GAME_SERVICE = {
      isLoading$,
      gameEvents$
    };

    const MOCK_CONF_SERVICE = {
      confSubject,
      conf$,
      loadConfig: () => {},
    };

    TestBed.configureTestingModule({
      declarations: [ GameBoardComponent ],
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
        {
          provide: ConfigurationService,
          useValue: MOCK_CONF_SERVICE,
        },
      ]
    })
    .compileComponents();

    logsService = TestBed.get(LogsService);
    gameService = TestBed.get(GameService);
    configurationService = TestBed.get(ConfigurationService);

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});
