import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from './master.service';
import { ApiService } from './api.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    MasterService,
    ApiService,
  ]
})
export class ServicesModule { }
