import {Component, OnInit} from '@angular/core';
import {LcTask} from "../../model/lc-task";
import {TaskService} from "../../services/task.service";

class LcTaskShow {
  id?: number;
  parentId?: number;
  name?: string;
  description?: string;
  priority?: string;
  status?: string;
  planStartTime?: Date;
  planEndTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  remark?: string;

  copy(task: LcTask) {
    Object.assign(this, task);

    this.planStartTime = this.nativeDate(task.planStartTime);
    this.planEndTime = this.nativeDate(task.planEndTime);
    this.actualStartTime = this.nativeDate(task.actualStartTime);
    this.actualEndTime = this.nativeDate(task.actualEndTime);
    this.priority = task.priority == null ? "0": `${task.priority}`;
  }


  nativeDate(value: number): Date | null {
    if (value == null) {
      // @ts-ignore
      return value
    }

    return new Date(value);
  }

  timestampDate(value: Date): number | null {
    if (value == null) {
      // @ts-ignore
      return value
    }

    return value.getTime();
  }

  toTask(): LcTask {
    const task: LcTask = new LcTask();
    Object.assign(task, this);
    task.planStartTime = this.timestampDate(this.planStartTime);
    task.planEndTime = this.timestampDate(this.planEndTime);
    task.actualStartTime = this.timestampDate(this.actualStartTime);
    task.actualEndTime = this.timestampDate(this.actualEndTime);
    task.priority = this.priority == null ? null : parseInt(this.priority, 10);

    return task;
  }
}

@Component({
  selector: 'app-task-edit-pane',
  templateUrl: './task-edit-pane.component.html',
  styleUrls: ['./task-edit-pane.component.scss']
})
export class TaskEditPaneComponent implements OnInit {
  taskShowed: LcTaskShow = new LcTaskShow();
  taskOrigin: LcTask;
  dirty: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  setTask(task: LcTask) {
    if (this.isDirty()) {
      this.trySaveData();
    }

    this.showNewTask(task);
  }

  isDirty(): boolean {
    return this.taskOrigin != null
      && this.taskOrigin.id == this.taskShowed.id
      && this.dirty;
  }

  showNewTask(task: LcTask) {
    this.taskOrigin = task;
    this.taskShowed.copy(task);
    this.dirty = false;
  }

  trySaveData() {
    if (confirm("Data is changed. Do you want to save it?")) {
      this.saveData();
    }
  }

  saveData() {
    const taskOrigin = this.taskOrigin;
    this.taskService.updateTask(this.taskShowed.toTask())
      .subscribe(task => {
        Object.assign(taskOrigin, task);
        this.dirty = false;
      });
  }

  apply() {
    this.saveData();
  }

  cancel() {
    this.showNewTask(this.taskOrigin);
  }

  notifyDirty() {
    this.dirty = true;
  }
}
