import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IProject } from "../interfaces/project.interface";
import { ITask } from "../interfaces/task.interface";

@Injectable()
export class TaskService { 
  constructor(private http: HttpClient) {}

  getAll(): Observable<ITask[]> {
    return this.http.get<ITask[]>('http://localhost:3000/tasks');
  }

  getTaskById(id: number): Observable<ITask> {
    return this.http.get<ITask>('http://localhost:3000/tasks/' + id);
  }

  getTaskByIdProject(id: string): Observable<ITask[]> {
    return this.http.get<ITask[]>('http://localhost:3000/tasks?idProject=' + id);
  }

  create(tasks: ITask): Observable<ITask> {
    return this.http.post<ITask>('http://localhost:3000/tasks', tasks);
  }

  update(tasks: ITask): Observable<ITask> {
    return this.http.put<ITask>('http://localhost:3000/tasks/' + tasks.id, tasks);
  }

  updateProcessTask(item: any, id: string): Observable<any> {
    return this.http.patch<any>('http://localhost:3000/tasks/' + id, item);
  }

  updateProcessProject(item: any, id: string): Observable<any> {
    return this.http.patch<any>('http://localhost:3000/projects/' + id, item);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/tasks/' + id);
  }
}