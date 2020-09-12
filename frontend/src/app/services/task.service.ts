import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";
import {AsyncSubject, BehaviorSubject, Observable} from "rxjs";
import {LcTask} from "../model/lc-task";

const TaskPrefix: string = 'task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    private api: ApiService) {

  }

  url(relativeUrl: string): string {
    return this.api.taskApi(`/task/${relativeUrl}`);
  }

  wrapperArray(response: Observable<Array<Object>>): Observable<LcTask[]> {
    const tasksSubject: AsyncSubject<LcTask[]> = new AsyncSubject<LcTask[]>();
    response.subscribe(result => {
      const tasks: LcTask[] = result.map(objValue => LcTask.of(objValue));
      tasksSubject.next(tasks);
      tasksSubject.complete();
    });
    return tasksSubject;
  }

  wrapperSingle(response: Observable<Object>): Observable<LcTask> {
    const taskSubject: AsyncSubject<LcTask> = new AsyncSubject<LcTask>();
    response.subscribe(result => {
      taskSubject.next(LcTask.of(result));
      taskSubject.complete();
    });
    return taskSubject;
  }

  queryRootTasks(): Observable<LcTask[]> {
    const response = this.http.get(this.url(''));
    // @ts-ignore
    return this.wrapperArray(response);
  }

  querySubTasks(id: number): Observable<LcTask[]> {
    const response = this.http.get(this.url(`${id}/sub-task`));
    // @ts-ignore
    return this.wrapperArray(response);
  }

  createTask(newTask: LcTask): Observable<LcTask> {
    const response = this.http.post(
      this.url(''),
      newTask);
    return this.wrapperSingle(response);
  }

  deleteTask(delTask: LcTask): Observable<LcTask> {
    const response = this.http.delete(
      this.url(`${delTask.id}`));
    return this.wrapperSingle(response);
  }

  updateTask(task: LcTask): Observable<LcTask> {
    const response = this.http.put(
      this.url(`${task.id}`),
      task);
    return this.wrapperSingle(response);
  }
}
