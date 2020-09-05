import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import { ProjectViewComponent } from './views/project-view/project-view.component';
import { DateViewComponent } from './views/date-view/date-view.component';
import { HistoryViewComponent } from './views/history-view/history-view.component';
import { TaskEditPaneComponent } from './components/task-edit-pane/task-edit-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectViewComponent,
    DateViewComponent,
    HistoryViewComponent,
    TaskEditPaneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatSliderModule,
    MatTabsModule,
    MatTreeModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
