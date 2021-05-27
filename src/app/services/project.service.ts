import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IProject } from "../interfaces/project.interface";

@Injectable()
export class ProjectService { 
  constructor(private http: HttpClient) {}

  getAll(): Observable<IProject[]> {
    return this.http.get<IProject[]>('http://localhost:3000/projects');
  }

  getProjectById(id: number): Observable<IProject> {
    return this.http.get<IProject>('http://localhost:3000/projects/' + id);
  }

  create(project: IProject): Observable<IProject> {
    return this.http.post<IProject>('http://localhost:3000/projects', project);
  }

  update(project: IProject): Observable<IProject> {
    return this.http.put<IProject>('http://localhost:3000/projects/' + project.id, project);
  }

  updateItem(item: any, id: string): Observable<any> {
    return this.http.patch<IProject>('http://localhost:3000/projects/' + id, item);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/projects/' + id);
  }
}