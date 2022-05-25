import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "floara-editor-dialog",
  templateUrl: "floara-editor-dialog.html",
})
export class FloaraEditorDialog {
  localData: any;

  constructor(
    public dialogRef: MatDialogRef<FloaraEditorDialog>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.localData = data;
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === "Escape") {
        this.doAction();
      }
    });

    this.dialogRef.backdropClick().subscribe((event) => {
      this.doAction();
    });
  }

  doAction() {
    this.dialogRef.close(this.localData);
  }

  closeDialog() {
    this.dialogRef.close(this.localData);
  }
}
