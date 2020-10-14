import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

import { ServicesModule } from './services/services.module';

import { ProjectViewComponent } from './views/project-view/project-view.component';
import { DateViewComponent } from './views/date-view/date-view.component';
import { HistoryViewComponent } from './views/history-view/history-view.component';
import { TaskEditPaneComponent } from './components/task-edit-pane/task-edit-pane.component';
import { TaskTreeComponent } from './components/task-tree/task-tree.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ProjectViewComponent,
    DateViewComponent,
    HistoryViewComponent,
    TaskEditPaneComponent,
    TaskTreeComponent,
    TaskFilterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatSliderModule,
    MatTabsModule,
    MatTreeModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMomentDateModule,
    MatRadioModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    NzDatePickerModule,
    NzFormModule,
    NzTableModule,

    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule { }
