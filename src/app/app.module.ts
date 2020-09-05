import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { DateViewComponent } from './views/date-view/date-view.component';
import { HistoryViewComponent } from './views/history-view/history-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectViewComponent,
    DateViewComponent,
    HistoryViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSliderModule,
    MatTabsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
