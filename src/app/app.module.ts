import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ApiUrlComponent } from './components/api-url/api-url.component';
import { StatsComponent } from './components/stats/stats.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { EventsComponent } from './components/events/events.component';
import { LogComponent } from './components/log/log.component';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
