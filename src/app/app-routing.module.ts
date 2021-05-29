import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProjectComponent } from './pages/projects/project.component';
import { TaskComponent } from './pages/tasks/task.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: ProjectComponent },
      { path: 'tasks/:id', component: TaskComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
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
