import {Component, Input, OnInit} from '@angular/core';
import {LcTask} from "../../model/lc-task";

@Component({
  selector: 'app-task-edit-pane',
  templateUrl: './task-edit-pane.component.html',
  styleUrls: ['./task-edit-pane.component.scss']
})
export class TaskEditPaneComponent implements OnInit {
  task: LcTask = new LcTask();

  constructor() { }

  ngOnInit(): void {
  }

  setTask(task: LcTask) {
    task.useNativeDate();
    this.task = task;
  }

  apply() {
    console.log(this.task);
  }
}
