import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { IProject } from "src/app/interfaces/project.interface";
import { ITask } from "src/app/interfaces/task.interface";
import { AlertService } from "src/app/services/alert.service";
import { DataService } from "src/app/services/data.service";
import { ProjectService } from "src/app/services/project.service";
import { TaskService } from "src/app/services/task.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent {
  loading: boolean = true;

  idProject: string;
  project: IProject;
  task: ITask;
  tasks: ITask[] = [];

  percentPath: number;
  percent: number;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private dataService: DataService) {
      this.idProject = this.route.snapshot.params.id;
      this.initialData();
    }
  
  initialData() {    
    this.dataService.task$
    .pipe(take(1))
      .subscribe(res => {
        if(res.length) {
          this.tasks = res.filter(task => task.idProject === this.idProject);

          this.loading = false;
          this.calculatePercent();
        } else {
          this.getTask();
        }
      });

    this.dataService.project$
    .pipe(take(1))
    .subscribe(project => {
      if(project.length) {
        project.filter(project => {
          if(project.id === this.idProject) this.project = project
        });

      } else {
        this.getProject();
      }
      
    })
  }

  getTask() {
    this.taskService.getAll()
    .pipe(take(1))
    .subscribe(result => {
      if (result) {
        this.tasks = result.filter(task => task.idProject === this.idProject);
        this.dataService.task = result;       

        this.loading = false;
        this.calculatePercent();
      }
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  getProject() {
    this.projectService.getAll()
    .subscribe(result => {
      result.map(project => {
        if(project.id === this.idProject) this.project = project
      })

      this.dataService.project  = result;
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  calculatePercent() {
    const count = this.tasks.length;

    let checked = 0;
    this.tasks.map(task => {
      task.done ? ++checked : checked
    });

    if (!count && !checked) {
      this.percent = 0;
      this.percentPath = 233;

      return
    }
    
    this.percent = parseInt(((checked / count) * 100).toString(), 10);

    this.percentPath = (233-(this.percent*2.33));
  }

  markIsDone(task: ITask) {
    if(task) {
      this.calculatePercent();

      const percent = { percent: this.percent }
      const done = { done: task.done }
  
      this.taskService.updateProcessTask(done, task.id)
      .subscribe(() => {

        this.taskService.updateProcessProject(percent, task.idProject)
        .subscribe(project => {
          this.dataService.project = project;
        }, err => {
          this.alertService.success('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
          console.log(err);
        })

      }, err => {
        this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
        console.log(err);
      })
    }
  }

  openDialog(): void {
    const config = new MatDialogConfig();
    config.width = "500px";
    config.data = {
      title: 'Criar nova tarefa'
    };

    const resultDialog = this.dialog.open(DialogComponent, config);

    resultDialog.afterClosed().subscribe(result => {
      if (result) {
        const id = this.getRandomId();

        const obj = {
          idProject: this.idProject,
          id: id,
          title: result.get('title').value,
          description: result.get('description').value,
          done: false,
          createdAt: new Date().toString()
        }

        this.task = obj;

        this.save();
      }
    })
  }

  openDialogEdit(task: ITask): void {
    const config = new MatDialogConfig();
    config.data = {
      title: 'Editar tarefa',
      fullForm: {
        title: task.title, 
        description: task.description
      }
    };
    config.width = "500px";
    
    const resultDialog = this.dialog.open(DialogComponent, config);

    resultDialog.afterClosed().subscribe(result => {
      if (result) {
        this.task = result.value;

        this.task.id = task.id;
        this.task.done = task.done;
        this.task.idProject = task.idProject
        this.task.createdAt = task.createdAt;

        this.update();
      }
    })
  }

  getRandomId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  save() {
    this.taskService.create(this.task)
    .subscribe(() => {
      this.getTask();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  update(): void {
    this.taskService.update(this.task)
    .subscribe(() => {
      this.alertService.success('Tarefa alterada com sucesso!', 'Fechar');

      this.getTask();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  delete(task: ITask): void {
    this.task = task;
    this.task.done = false;

    this.markIsDone(this.task);

    this.taskService.delete(task.id)
    .subscribe(() => {
      this.alertService.success('Tarefa excluída com sucesso!', 'Fechar');

      this.getTask();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }
}