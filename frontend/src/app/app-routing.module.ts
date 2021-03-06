import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { DateViewComponent } from './views/date-view/date-view.component';
import { HistoryViewComponent } from './views/history-view/history-view.component';
// import {HashLocationStrategy, LocationStrategy} from "@angular/common";

const routes: Routes = [
  {
    path: 'project-view',
    component: ProjectViewComponent
  }, {
    path: 'date-view',
    component: DateViewComponent
  }, {
    path: 'history-view',
    component: HistoryViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule { }
