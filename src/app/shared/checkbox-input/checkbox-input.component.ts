import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-checkbox-input",
  templateUrl: "./checkbox-input.component.html",
  styleUrls: ["./checkbox-input.component.css"],
})
export class CheckboxInputComponent implements OnInit {
  @Input() label: string = "";
  @Input() value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  constructor() {
    console.log("Checkbox Rendered");
  }

  ngOnInit(): void {}

  onValueUpdate($event: any) {
    this.valueChange.emit($event.checked);
  }
}
