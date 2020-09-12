import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
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

  queryRootTasks(): Observable<LcTask[]> {
    // @ts-ignore
    return this.http.get(this.url(''));
  }

  querySubTasks(id: number): Observable<LcTask[]> {
    // @ts-ignore
    return this.http.get(this.url(`${id}/sub-task`));
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
