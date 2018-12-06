import { Observable, BehaviorSubject } from 'rxjs';
import { GameService, IStats, IGameResponse } from './../../services/game.service';
import { ConfigurationService } from './../../services/configuration.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import SpyObj = jasmine.SpyObj;

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  let gameService: SpyObj<GameService>;
  let configurationService: SpyObj<ConfigurationService>;

  beforeEach(async(() => {
    const gameEventsSubject: BehaviorSubject<IGameResponse[]> = new BehaviorSubject<IGameResponse[]>([]);
    const gameStats$: Observable<IGameResponse[]> = gameEventsSubject.asObservable();
    const confSubject: BehaviorSubject<IStats[]> = new BehaviorSubject<IGameConfig>(null);
    const conf$: Observable<IStats[]> = confSubject.asObservable();

    const MOCK_GAME_SERVICE = {
      updateStats: () => {},
      gameStats$
    };
    const MOCK_CONF_SERVICE = {
      confSubject,
      conf$,
      updateStats: () => {},
    };

    TestBed.configureTestingModule({
      declarations: [ StatsComponent ],
      providers: [
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

    gameService = TestBed.get(GameService);
    configurationService = TestBed.get(ConfigurationService);

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});
