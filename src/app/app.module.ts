import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule  } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TaskComponent } from './pages/tasks/task.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProjectComponent } from './pages/projects/project.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { DataService } from './services/data.service';
import { AlertService } from './services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TaskComponent,
    ProjectComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
    MatProgressBarModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    MatRippleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [
    ProjectService,
    TaskService,
    DataService,
    AlertService,
    { provide: LOCALE_ID, useValue: "pt-BR" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
