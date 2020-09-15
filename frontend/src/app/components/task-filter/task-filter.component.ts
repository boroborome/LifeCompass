import {Component, Input, OnInit} from '@angular/core';
import {EnumItem} from "../../utils/enum-item";
import {MasterService} from "../../services/master.service";
import {TaskFilter} from "../../model/task-filter";

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnInit {
  filter: TaskFilter = new TaskFilter();

  taskStatusRange: EnumItem[] = [];
  constructor(private masterService: MasterService,) { }

  ngOnInit(): void {
    this.masterService.getTaskStatus()
      .subscribe((data: EnumItem[]) => this.taskStatusRange = data);
  }

}
