import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";

import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { ITask } from "src/app/interfaces/task.interface";
import { DataService } from "src/app/services/data.service";
import { TaskService } from "src/app/services/task.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  idProject: string;
  task: ITask;
  tasks: ITask[] = [];

  percentPath: number;
  percent: number;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private dataService: DataService,
    private _snackBar: MatSnackBar) {
      this.idProject = this.route.snapshot.params.id;
      this.initialData();
    }

  ngOnInit() {}
  
  initialData() {    
    this.dataService.task$
    .pipe(take(1))
      .subscribe(res => {
        console.log(res)
        if(res.length) {
          this.tasks = res.filter(task => task.idProject === this.idProject);

          this.calculatePercent();
        } else {
          this.getTask();
        }
      });
  }

  getTask() {
    this.taskService.getAll()
    .pipe(take(1))
    .subscribe(result => {
      console.log(result)
      if (result) {
        this.tasks = result.filter(task => task.idProject === this.idProject);
        this.dataService.task = result;       

        this.calculatePercent();
      }
    })
  }

  calculatePercent() {
    const count = this.tasks.length;

    let checked = 0;
    this.tasks.map(task => {
      task.done ? ++checked : checked
    });

    console.log(checked, count)

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
        }, err => { console.log(err) })

      }, err => { console.log(err) });
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
          done: false
        }

        this.task = obj;

        this.save();
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
      this._snackBar.open('Tarefa salva com sucesso!', 'Fechar', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });

      this.getTask();
    })
  }
}