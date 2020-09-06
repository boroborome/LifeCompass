import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { EnumItem } from '../utils/enum-item';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private http: HttpClient,
    private api: ApiService) { }

  getTaskStatus(): Observable<any> {
    return this.http.get(this.api.taskApi('master/task-status'));
  }
}
