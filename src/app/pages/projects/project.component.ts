import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { 
  MatSnackBar, 
  MatSnackBarHorizontalPosition, 
  MatSnackBarVerticalPosition 
} from "@angular/material/snack-bar";
import { take } from "rxjs/operators";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { IProject } from "src/app/interfaces/project.interface";
import { ITask } from "src/app/interfaces/task.interface";
import { DataService } from "src/app/services/data.service";
import { ProjectService } from "src/app/services/project.service";
import { TaskService } from "src/app/services/task.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [DatePipe]
})

export class ProjectComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  project: IProject;
  data: IProject[] = [];
  tasks: ITask[] = [];

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService,
    private taskService: TaskService,
    private dataService: DataService) { 
      this.initialData();
    }

  ngOnInit(): void {}

  initialData() {
    this.dataService.project$
    .pipe(take(1))
      .subscribe(res => { 
        if(res.length) {
          this.data = res;
        } else {
          this.getAll();
        } 
      });

    this.dataService.task$
    .pipe(take(1))
      .subscribe(res => { 
        if(res.length) {
          this.tasks = res;
        } else {
          this.getAllTasks();
        } 
      });    
  }

  getAll(): void {
    this.projectService.getAll()
    .subscribe(result => {
      this.data = result;
      this.dataService.project  = result;
    })
  }

  getAllTasks(): void {
    this.taskService.getAll()
    .subscribe(result => {
      this.dataService.task  = result;
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
    this.project.createdAt = this.datePipe.transform(this.project.createdAt, 'dd/MM/yyyy');

    this.projectService.create(this.project)
    .subscribe(data => {
      this._snackBar.open('Projeto criado com sucesso!', 'Fechar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      this.getAll();
    })
  }

  update(): void {
    this.projectService.update(this.project)
    .subscribe(() => {
      this._snackBar.open('Projeto alterado com sucesso!', 'Fechar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      this.getAll();
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
      this._snackBar.open('Projeto excluído com sucesso!', 'Fechar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      this.getAll();
    })
  }

}