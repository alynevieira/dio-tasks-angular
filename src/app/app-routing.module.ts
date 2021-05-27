import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectComponent } from './pages/projects/project.component';
import { TaskComponent } from './pages/tasks/task.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: ProjectComponent },
      { path: 'tasks/:id', component: TaskComponent },
    ]
  },
 
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
