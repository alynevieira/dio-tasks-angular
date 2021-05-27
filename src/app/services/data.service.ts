import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from 'rxjs/operators';

import { IProject } from "../interfaces/project.interface";
import { ITask } from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private projects = new BehaviorSubject<IProject[]>([]);
  private tasks = new BehaviorSubject<ITask[]>([]);

  get task$(): Observable<ITask[]> {
    return this.tasks.asObservable().pipe(filter(res => !!res));
  }

  set task(value: ITask[]) {
    this.tasks.next(value);
  }
  
  get project$(): Observable<IProject[]> {
    return this.projects.asObservable().pipe(filter(res => !!res));
  }

  set project(value: IProject[]) {
    this.projects.next(value);
  }
}