import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-date-input",
  templateUrl: "./date-input.component.html",
  styleUrls: ["./date-input.component.css"],
})
export class DateInputComponent implements OnInit {
  @Input() label: string = "";
  @Input() value: any = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() readOnly: boolean = false;
  tempDate: any;

  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor() {
    console.log("Date Rendered");
  }

  ngOnInit(): void {
    this.value = this.value ? new Date(this.value) : new Date();

    this.tempDate = {
      date: {
        year: this.value.getFullYear(),
        month: this.value.getMonth() + 1,
        day: this.value.getDate(),
      },
    };
  }

  onValueUpdate($event: any) {
    this.valueChange.emit($event.target.value.toISOString());
  }
}
