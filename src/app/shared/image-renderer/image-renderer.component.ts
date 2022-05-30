import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-image-renderer",
  templateUrl: "./image-renderer.component.html",
  styleUrls: ["./image-renderer.component.scss"],
})
export class ImageRendererComponent implements OnInit {
  @Input() label: string = "";
  @Input() value: any;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  onImagePickerDialog() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/gif, image/jpeg";

    input.onchange = (e) => {
      // getting a hold of the file reference
      var file = (e.target as HTMLInputElement).files[0];
      // // setting up the reader
      var reader = new FileReader();
      reader.readAsDataURL(file); // this is reading as data url
      // // here we tell the reader what to do when it's done reading...
      reader.onload = (e) => {
        this.value = reader.result;
        this.onValueUpdate(this.value);
      };
    };

    input.click();
  }

  onValueUpdate(value: any) {
    console.log(value);
    this.valueChange.emit(value);
  }
}
