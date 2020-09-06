import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  taskApi(relativeUrl: string): string {
    return `/api/${relativeUrl}`;
  }
}
