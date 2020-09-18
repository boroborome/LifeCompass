import {Component, OnInit} from '@angular/core';
import {LcTask} from "../../model/lc-task";
import {TaskService} from "../../services/task.service";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import * as moment from "moment";
import {EnumItem} from "../../utils/enum-item";
import {MasterService} from "../../services/master.service";

class LcTaskShow extends LcTask {
  static DATE_FORMAT = 'YYYY-MM-DD';
  static DATE_TIME_FORMAT = LcTaskShow.DATE_FORMAT + ' HH:mm';

  statusStr?: string;
  planStartTimeStr?: string;
  planEndTimeStr?: string;
  actualStartTimeStr?: string;
  actualEndTimeStr?: string;
  priority?: number;

  copy(task: LcTask) {
    Object.assign(this, task);

    this.planStartTimeStr = this.stringDate(task.planStartTime);
    this.planEndTimeStr = this.stringDate(task.planEndTime);
    this.actualStartTimeStr = this.stringDate(task.actualStartTime);
    this.actualEndTimeStr = this.stringDate(task.actualEndTime);
    this.statusStr = task.status != null ? task.status.toString() : "0";
    this.refreshPriority();
  }

  refreshPriority() {
    this.priority = LcTask.calculateTaskScore(this);
  }

  stringDate(timestamp: number): string | null {
    if (timestamp == null) {
      // @ts-ignore
      return timestamp
    }

    return moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm');
  }

  timestampDate(value: string): number | null {
    if (value == null) {
      // @ts-ignore
      return value
    }
    return new Date(value).getTime();
  }

  toTask(): LcTask {
    const task: LcTask = new LcTask();
    Object.assign(task, this);
    task.planStartTime = this.timestampDate(this.planStartTimeStr);
    task.planEndTime = this.timestampDate(this.planEndTimeStr);
    task.actualStartTime = this.timestampDate(this.actualStartTimeStr);
    task.actualEndTime = this.timestampDate(this.actualEndTimeStr);
    task.status = this.statusStr == null ? 0 : parseInt(this.statusStr)

    return task;
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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
  planStartFormControl = new FormControl('', [
    Validators.pattern(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])( (20|21|22|23|[0-1]\d):[0-5]\d)?$/),
  ]);
  planEndFormControl = new FormControl('', [
    Validators.pattern(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])( (20|21|22|23|[0-1]\d):[0-5]\d)?$/),
  ]);
  matcher = new MyErrorStateMatcher();

  taskStatusRange: EnumItem[] = [];

  constructor(private taskService: TaskService,
              private masterService: MasterService,
              ) { }

  ngOnInit(): void {
    this.masterService.getTaskStatus()
      .subscribe((data: EnumItem[]) => this.taskStatusRange = data);
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
    this.taskShowed.copy(task == null ? {} : task);
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
    this.taskShowed.refreshPriority();
    this.dirty = true;
  }
}
