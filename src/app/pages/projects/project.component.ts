import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { take } from "rxjs/operators";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { IProject } from "src/app/interfaces/project.interface";
import { ITask } from "src/app/interfaces/task.interface";
import { AlertService } from "src/app/services/alert.service";
import { DataService } from "src/app/services/data.service";
import { ProjectService } from "src/app/services/project.service";
import { TaskService } from "src/app/services/task.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent {
  loading: boolean = true;

  project: IProject;
  data: IProject[] = [];
  tasks: ITask[] = [];

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dataService: DataService) { 
      this.initialData();
  }

  initialData(): void {
    this.dataService.task$
    .pipe(take(1))
      .subscribe(res => { 
        if(res.length) {
          this.tasks = res;

           this.loading = false;
        } else {
          this.getAllTasks();
        } 
      });

      this.dataService.project$
      .pipe(take(1))
        .subscribe(res => { 
          if(res.length) {
            this.data = res;
  
            this.data.map(project => {
              let tasksOfProject = this.tasks.filter(result => result.idProject === project.id);
              let data = this.dataService.calculatePercent(tasksOfProject, project.id);

              project.percent = data.percent;
            })
  
            this.loading = false;
          } else {
            this.getAll();
          } 
        });
  }

  getAll(): void {
    this.projectService.getAll()
    .subscribe(result => {
      this.data = result;
      this.dataService.project  = result;

      this.data.map(project => {
        this.dataService.task$.subscribe(data => {
          let tasksOfProject = data.filter(result => result.idProject === project.id);
          let dataPercent = this.dataService.calculatePercent(tasksOfProject, project.id);
  
          project.percent = dataPercent.percent;
        })
      })

      this.loading = false;
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  getAllTasks(): void {
    this.taskService.getAll()
    .subscribe(result => {
      this.dataService.task  = result;

      this.loading = false;
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  openDialog(): void {
    const config = new MatDialogConfig();
    config.width = "500px";
    config.data = {
      title: 'Criar novo projeto'
    };

    const resultDialog = this.dialog.open(DialogComponent, config);

    resultDialog.afterClosed().subscribe(result => {
      if (result) {
        this.project = result.value;

        this.project.id = this.getRandomId();
        this.project.percent = 0;
        this.project.createdAt = new Date().toString();

        this.save();
      }
    })
  }

  openDialogEdit(project: IProject): void {
    const config = new MatDialogConfig();
    config.data = {
      title: 'Editar projeto',
      fullForm: {
        title: project.title, 
        description: project.description
      }
    };
    config.width = "500px";
    
    const resultDialog = this.dialog.open(DialogComponent, config);

    resultDialog.afterClosed().subscribe(result => {
      if (result) {
        this.project = result.value;

        this.project.id = project.id;
        this.project.percent = project.percent;
        this.project.createdAt = project.createdAt;

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

  save(): void {
    this.projectService.create(this.project)
    .subscribe(() => {
      this.alertService.success('Projeto criado com sucesso!', 'Fechar');

      this.getAll();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  update(): void {
    this.projectService.update(this.project)
    .subscribe(() => {
      this.alertService.success('Projeto alterado com sucesso!', 'Fechar');

      this.getAll();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

  delete(id: string): void {
    this.tasks.map(result => {
      if (result.idProject === id) {
        this.taskService.delete(result.id).subscribe(() => {}, err => { console.log(err) })
      }
    })

    this.projectService.delete(id)
    .subscribe(() => {
      this.alertService.success('Projeto excluído com sucesso!', 'Fechar');

      this.getAll();
    }, err => {
      this.alertService.error('Ocorreu um erro, tente novamente mais tarde', 'Fechar');
      console.log(err);
    })
  }

}