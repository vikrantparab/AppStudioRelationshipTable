import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "item-control",
  templateUrl: "item-control.html",
})
export class ItemDialog {
  localData: string;

  constructor(
    public dialogRef: MatDialogRef<ItemDialog>,
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
