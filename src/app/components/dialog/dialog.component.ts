import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})

export class DialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: [''],
      description: ['']
    });

    if(this.modalData && this.modalData.fullForm) {
      this.formGroup.patchValue(this.modalData.fullForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}