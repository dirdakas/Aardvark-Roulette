import { ConfigurationService } from 'src/app/services/configuration.service';
import { LogsService } from './services/logs.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ApiUrlComponent } from './components/api-url/api-url.component';
import { StatsComponent } from './components/stats/stats.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { EventsComponent } from './components/events/events.component';
import { LogComponent } from './components/log/log.component';
import { GameService } from './services/game.service';

@NgModule({
  declarations: [
    AppComponent,
    ApiUrlComponent,
    StatsComponent,
    GameBoardComponent,
    EventsComponent,
    LogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    LogsService,
    GameService,
    ConfigurationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
