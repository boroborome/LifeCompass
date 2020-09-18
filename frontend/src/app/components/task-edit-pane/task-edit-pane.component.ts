import {Component, OnInit} from '@angular/core';
import {LcTask} from "../../model/lc-task";
import {TaskService} from "../../services/task.service";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import * as moment from "moment";
import {EnumItem} from "../../utils/enum-item";
import {MasterService} from "../../services/master.service";

class LcTaskShow {
  static DATE_FORMAT = 'YYYY-MM-DD';
  static DATE_TIME_FORMAT = LcTaskShow.DATE_FORMAT + ' HH:mm';

  id?: number;
  parentId?: number;
  name?: string;
  description?: string;
  priority?: string;
  status?: string;
  planStartTime?: string;
  planEndTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  remark?: string;
  opportunity?: number;
  painLevel?: number;
  yearnLevel?: number;

  copy(task: LcTask) {
    Object.assign(this, task);

    this.planStartTime = this.stringDate(task.planStartTime);
    this.planEndTime = this.stringDate(task.planEndTime);
    this.actualStartTime = this.stringDate(task.actualStartTime);
    this.actualEndTime = this.stringDate(task.actualEndTime);
    this.priority = task.priority == null ? "0": `${task.priority}`;
    this.status = task.status != null ? task.status.toString() : "0";
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
    task.planStartTime = this.timestampDate(this.planStartTime);
    task.planEndTime = this.timestampDate(this.planEndTime);
    task.actualStartTime = this.timestampDate(this.actualStartTime);
    task.actualEndTime = this.timestampDate(this.actualEndTime);
    task.priority = this.priority == null ? 0 : parseInt(this.priority, 10);
    task.status = this.status == null ? 0 : parseInt(this.status)

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
    this.dirty = true;
  }
}
