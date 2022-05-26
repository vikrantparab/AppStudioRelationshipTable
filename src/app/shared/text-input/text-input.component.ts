import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: ["./text-input.component.scss"],
})
export class TextInputComponent implements OnInit {
  @Input() label: string = "";
  @Input() value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  @Input() conditionalFormatting: any;
  @Input() rowData: any;
  constructor() {}

  ngOnInit(): void {}

  onValueUpdate($event: any) {
    console.log($event.target.value);
    this.valueChange.emit($event.target.value);
  }
}
