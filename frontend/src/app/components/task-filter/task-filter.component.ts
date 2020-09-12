import { Component, OnInit } from '@angular/core';
import {EnumItem} from "../../utils/enum-item";
import {MasterService} from "../../services/master.service";

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnInit {
  taskStatusRange: EnumItem[] = [];
  constructor(private masterService: MasterService,) { }

  ngOnInit(): void {
    this.masterService.getTaskStatus()
      .subscribe((data: EnumItem[]) => this.taskStatusRange = data);
  }

}
