import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LogicalOperators, Operators } from "src/app/_util/util.service";

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
  @Input() customData: any;
  constructor() {}

  ngOnInit(): void {
    console.log("Input Props", this.customData.control);
  }

  onValueUpdate($event: any) {
    this.valueChange.emit($event.target.value);
  }

  applyConditionalFormatting() {
    let formattingStyle = {};
    const { rowData, columnIdToNameMap, control } = this.customData;
    control.conditionalFormats.forEach((cf) => {
      const styles =
        this.validateFormattingRules(cf, rowData, columnIdToNameMap) || null;
      if (styles) {
        formattingStyle = styles;
      }
    });

    console.log(formattingStyle);
    return this.getControlStyles(formattingStyle);
  }

  private validateFormattingRules(
    conditionalFormatting: any,
    rowData,
    columnIdToNameMap
  ): any {
    let previousResult = false;
    let result = false;
    conditionalFormatting.rule.forEach((r) => {
      result = this.validateRule(r, rowData, columnIdToNameMap);
      if (typeof r.logicalOperator == "object") {
        previousResult = result;
      } else {
        previousResult =
          r.logicalOperator == LogicalOperators.And
            ? previousResult && result
            : previousResult || result;
      }
    });

    if (previousResult) {
      return {
        foregroundColor: conditionalFormatting.foregroundColor,
        backgroundColor: conditionalFormatting.backgroundColor,
        bold: conditionalFormatting.bold,
        italic: conditionalFormatting.italic,
        underline: conditionalFormatting.underline,
      };
    } else return null;
  }

  private validateRule(rule: any, rowData, columnIdToNameMap) {
    const fieldName = columnIdToNameMap[rule.field.id];
    const fieldValue = rowData[fieldName].value;
    const comparatorValue = rule.values[0];

    return this.evaluateCondition(fieldValue, comparatorValue, rule.operator);
  }

  private evaluateCondition(
    fieldValue: any,
    comparatorValue: any,
    operator: Operators
  ) {
    switch (operator) {
      case Operators.Contains:
        return fieldValue.includes(comparatorValue);

      case Operators.EndsWith:
        return fieldValue.endsWith(comparatorValue);

      case Operators.EqualTo:
        return fieldValue == comparatorValue;

      case Operators.GreaterThan:
        return Number(fieldValue) > Number(comparatorValue);

      case Operators.GreaterThanEqualTo:
        return Number(fieldValue) >= Number(comparatorValue);

      case Operators.LessThan:
        return Number(fieldValue) < Number(comparatorValue);

      case Operators.LessThanEqualTo:
        return Number(fieldValue) <= Number(comparatorValue);

      case Operators.NotEqualTo:
        return fieldValue != comparatorValue;

      case Operators.StartsWith:
        return fieldValue.startsWith(comparatorValue);

      default:
        return false;
    }
  }

  getControlStyles(formattingStyles: any): any {
    let style = {
      color: formattingStyles.foregroundColor,
      "background-color": formattingStyles.backgroundColor,
      "font-weight": formattingStyles.bold ? "bold" : "",
      "font-style": formattingStyles.italic ? "italic" : "",
      "text-decoration": formattingStyles.underline ? "underline" : "",
    };
    return style;
  }
}
