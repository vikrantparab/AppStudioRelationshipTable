import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.css"],
})
export class DateInputComponent implements OnInit {
  @Input() label: string = "";
  @Input() value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  constructor() {
    console.log("Date Rendered");
  }

  ngOnInit(): void {}

  onValueUpdate($event: any) {
    this.valueChange.emit($event.target.value.toISOString());
  }
}
