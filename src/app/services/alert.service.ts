import { Injectable } from "@angular/core";
import { 
  MatSnackBar,
  MatSnackBarHorizontalPosition, 
  MatSnackBarVerticalPosition } 
from "@angular/material/snack-bar";

@Injectable()
export class AlertService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  success(message, button) {
    this._snackBar.open(message, button, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['green-snackbar']
    });
  }

  error(message, button) {
    this._snackBar.open(message, button, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: ['red-snackbar']
    });
  }
}