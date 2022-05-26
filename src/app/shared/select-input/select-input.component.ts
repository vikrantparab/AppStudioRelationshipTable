import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-list-input",
  templateUrl: "./select-input.component.html",
  styleUrls: ["./select-input.component.scss"],
})
export class SelectInputComponent {
  @Input() value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  @Input() options: any[];
  constructor() {
    console.log("Input Rendered..");
  }

  onValueUpdate($event: any) {
    this.valueChange.emit($event.value);
  }
}
