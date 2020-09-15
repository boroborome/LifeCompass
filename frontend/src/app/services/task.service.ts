import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {LcTask} from "../model/lc-task";
import {TaskFilter} from "../model/task-filter";

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

  queryRootTasks(): Observable<LcTask[]> {
    // @ts-ignore
    return this.http.get(this.url(''));
  }

  querySubTasks(filter: TaskFilter): Observable<LcTask[]> {
    // @ts-ignore
    return this.http.post(this.url(''),
      filter,
      {headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'cmd': 'query-sub-tasks'
        })});
  }

  createTask(newTask: LcTask): Observable<LcTask> {
    return this.http.post(
      this.url(''),
      newTask);
  }

  deleteTask(delTask: LcTask): Observable<LcTask> {
    return this.http.delete(
      this.url(`${delTask.id}`));
  }

  updateTask(task: LcTask): Observable<LcTask> {
    return this.http.put(
      this.url(`${task.id}`),
      task);
  }
}
