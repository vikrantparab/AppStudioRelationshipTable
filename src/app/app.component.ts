import { Component, OnInit, ViewChild } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { random } from "lodash";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { FloaraEditorDialog } from "./Components/FloaraEditorDialog/floara-editor-dialog.component";
import { ItemDialog } from "./Components/ItemContorl/item-control";
// import * as tableConfig from "../assets/Table.json";
import * as tableConfig from "../assets/TableLess.json";
import * as tableDataArray from "../assets/DataArray.json";
import * as relMetadata from "../assets/RelationshipMetaData.json";
import * as ConditionalFormatting from "../assets/ConditionalFormattingSimple.json";
import * as _ from "lodash";
import { ControlType, DataType } from "src/assets/enum";
import { MatTable } from "@angular/material/table";
import { generateGuidId, getDiffObjects } from "./_util/util.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  CONTROL_TYPE = ControlType;
  TABLE_CONFIG: any = (tableConfig as any).default;
  TABLE_DATA_ARRAY: any = (tableDataArray as any).default;
  REL_METADATA: any = (relMetadata as any).default;
  CONDITIONAL_FORMATTING: any = (ConditionalFormatting as any).default;
  displayedColumns: string[] = [];
  displayedColumnsLabels: any = {};
  dataSourceModel: any = {};
  dataSource = [];
  rootDataSource: any;
  newTableColumns: any;
  readOnly = true;
  columnIdToNameMap = {};
  ignoredProps = [
    "id",
    "readOnly",
    "action",
    "related.id",
    "type",
    "related.type",
  ];
  relationshipType: string = "";

  constructor(public dialog: MatDialog) {}

  onRichtextClick(obj, index) {
    const dialogRef = this.dialog.open(FloaraEditorDialog, {
      data: obj,
      width: "70%",
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dataSource[index].Richtext.data = result || "";
    });
  }

  onItemClick(obj, index) {
    const dialogRef = this.dialog.open(ItemDialog, {
      data: obj,
      width: "350px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("res: ", result);
      this.dataSource[index].Item.data = result || "";
    });
  }

  ngOnInit() {
    if (this.TABLE_CONFIG.columns) {
      this.TABLE_CONFIG.columns.forEach((element) => {
        this.columnIdToNameMap[element.control.id] = element.control.name;
        let control = element.control;
        this.displayedColumns.push(control.name);
        this.displayedColumnsLabels[control.name] = control.label;
        this.dataSourceModel[control.name] = {
          type: control.type,
          dataType: control.dataType,
          conditionalFormats: control.conditionalFormats,
          width: element.width,
        };
      });
      this.displayedColumns.push("action");
      this.displayedColumnsLabels["action"] = "Actions";
      console.log(this.displayedColumns);

      this.TABLE_DATA_ARRAY.forEach((element, index) => {
        let dataSourceObj = {};
        if (element.properties) {
          let matchedKeys = Object.keys(element.properties).filter(
            (key) => this.displayedColumns.indexOf(key) != -1
          );
          // Relationship properties implementation pending
        }
        if (element.relatedItem && element.relatedItem.properties) {
          let matchedKeys = Object.keys(element.relatedItem.properties).filter(
            (key) => this.displayedColumns.indexOf("related." + key) != -1
          );
          matchedKeys.forEach((matchedKey) => {
            let matchedMetadataProperty =
              this.REL_METADATA.relatedItem.properties.find(
                (ele) => ele.name == matchedKey
              );
            let propertyValue = element.relatedItem.properties[matchedKey];
            dataSourceObj["related." + matchedKey] = { value: propertyValue };
            let matchedControl = this.dataSourceModel["related." + matchedKey];
            let controlType = matchedControl.type;
            let controlDataType = matchedControl.dataType;
            dataSourceObj["related." + matchedKey]["type"] = controlType;
            dataSourceObj["related." + matchedKey]["dataType"] =
              controlDataType;
            dataSourceObj["related." + matchedKey]["conditionalFormats"] =
              matchedControl.conditionalFormats
                ? matchedControl.conditionalFormats
                : [];
            dataSourceObj["related." + matchedKey]["width"] =
              matchedControl.width;

            if (
              matchedControl.dataType == DataType.List ||
              matchedControl.dataType == DataType.MultiValueList
            ) {
              dataSourceObj["related." + matchedKey]["options"] =
                matchedMetadataProperty.dataSource.listOptions;
            }
          });
        }
        dataSourceObj["id"] = element.id;
        dataSourceObj["related.id"] = element.relatedItem.id;
        dataSourceObj["related.type"] = element.relatedItem.type;
        dataSourceObj["index"] = index;
        dataSourceObj["action"] = { type: "action", width: 5 };
        this.relationshipType = element.type;

        if (Object.keys(dataSourceObj)) this.dataSource.push(dataSourceObj);
      });
    }

    this.rootDataSource = JSON.parse(JSON.stringify(this.dataSource));
  }

  dropTable(event: CdkDragDrop<string[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.dataSource = this.updateIndexes(this.dataSource);
    this.table.renderRows();
  }

  toggleReadOnly(isReadOnly) {
    this.readOnly = isReadOnly;
    // this.dataSource.forEach((item) => {
    //   item["readOnly"] = isReadOnly;
    // });
    // console.log(this.dataSource);
  }

  onImagePickerDialog(elementColumnObj) {
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
      reader.onload = (e) => (elementColumnObj.imageSrc = reader.result);
    };

    input.click();
  }

  onFilePickerDialog(elementColumnObj) {
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = (e) => {
      // getting a hold of the file reference
      var file = (e.target as HTMLInputElement).files[0];
      // // setting up the reader
      var reader = new FileReader();
      reader.readAsDataURL(file); // this is reading as data url
      // // here we tell the reader what to do when it's done reading...
      elementColumnObj.name = file.name;
      reader.onload = (e) => (elementColumnObj.data = reader.result);
    };

    input.click();
  }

  sortData(sort: Sort) {
    const data = this.dataSource.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource = data;
      return;
    }

    this.dataSource = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      let firstObj = a[sort.active];
      let secondObj = b[sort.active];
      if (!firstObj.dataType) return 0;
      switch (firstObj.dataType) {
        case "string":
        case "number":
          return this.compareStringOrNumber(
            firstObj.name,
            secondObj.name,
            isAsc
          );
        default:
          return 0;
      }
    });
  }

  compareStringOrNumber(
    a: number | string,
    b: number | string,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setShortDate(element, $event) {
    let shortDate = new Date($event.value).toLocaleDateString("en-US");
    element.shortDate = shortDate;
    element.name = new Date($event.value);
  }
  getShortDate(element) {
    return element.shortDate;
  }

  onRowEditStart(element: any) {
    const updatedProps = {
      action:
        element.action.value !== "add"
          ? { ...element.action, value: "update" }
          : element.action,
      readOnly: false,
    };
    this.dataSource = this.updateDataSource(element, updatedProps);
    this.dataSource = this.updateIndexes(this.dataSource);
    this.table.renderRows();
  }

  onRowEditDone(element: any) {
    const updatedProps = {
      readOnly: true,
    };
    this.dataSource = this.updateDataSource(element, updatedProps);
    this.dataSource = this.updateIndexes(this.dataSource);
    this.table.renderRows();
  }

  onRowDelete(element: any) {
    const updatedProps = { action: { ...element.action, value: "delete" } };
    this.dataSource = this.updateDataSource(element, updatedProps);
    this.dataSource = this.updateIndexes(this.dataSource);
    this.table.renderRows();
  }

  updateDataSource(element: any, updatedProps: any) {
    const updatedObject = { ...element, ...updatedProps };
    this.dataSource[element.index] = updatedObject; // insert at specific index

    return this.dataSource;
  }

  saveRelationshipData() {
    this.dataSource = this.updateIndexes(this.dataSource);
    var differentialDataSource = this.evaluateDifference();
    const apiRes = {
      type: this.relationshipType,
      items: this.mapDataSourceToApiResponse(differentialDataSource),
    };
    // Add a mapper to map dataSource to API response
    console.log(JSON.stringify(apiRes));
    return apiRes;
  }

  mapDataSourceToApiResponse(differentialDataSource: any[]) {
    const excludedProps = ["id", "type", "action", "index"];
    return differentialDataSource.map((d) => {
      let item: any = { properties: {}, relatedItem: { properties: {} } };
      Object.keys(d).forEach((key) => {
        if (key === "action") {
          const actionValue: any = d[key].value;
          item = {
            ...item,
            action: actionValue ? actionValue : "update",
            relatedItem: {
              ...item.relatedItem,
              action: actionValue ? actionValue : "update",
            },
          };
        } else if (key.includes("related.")) {
          const property = key.split(".")[1];
          if (excludedProps.includes(property)) {
            item.relatedItem = {
              ...item.relatedItem,
              [property]: this.setPropertyValue(d, key),
            };
          } else {
            item.relatedItem = {
              properties: {
                ...item.relatedItem.properties,
                [property]: this.setPropertyValue(d, key),
              },
            };
          }
        } else {
          if (excludedProps.includes(key)) {
            item = {
              ...item,
              [key]: this.setPropertyValue(d, key),
            };
          } else {
            item.properties = {
              ...item.properties,
              [key]: this.setPropertyValue(d, key),
            };
          }
        }
      });

      return item;
    });
  }

  setPropertyValue(d, key) {
    return _.has(d[key], "value") || typeof d[key] == "object"
      ? d[key].value
      : d[key];
  }

  evaluateDifference() {
    const diffIds: string[] = getDiffObjects(
      this.rootDataSource,
      this.dataSource,
      this.ignoredProps
    ).map((d: any) => d.id);
    const differentialObjects: any[] = diffIds.map((d: any) =>
      this.dataSource.find((ds: any) => ds.id === d)
    );
    const origObjects = this.rootDataSource.filter((r: any) =>
      diffIds.includes(r.id)
    );

    let finalJson: any[] = [];
    differentialObjects.forEach((d) => {
      d = { ...d, action: d.action === "" ? "update" : d.action };
      const orgObj = origObjects.find((o: any) => o.id === d.id);
      if (orgObj) {
        const diffProps = getDiffObjects(orgObj, d, this.ignoredProps);
        finalJson.push(diffProps);
      } else finalJson.push(d);
    });

    return finalJson;
  }

  addNewItem(existingIndex: any) {
    const newIndex = existingIndex + 1;

    const newItem = this.createEmptyRow(this.dataSource[0], newIndex);

    this.dataSource.splice(newIndex, 0, newItem);

    this.dataSource = this.updateIndexes(this.dataSource);

    this.table.renderRows();
  }

  updateIndexes(dataSource: any[]) {
    return dataSource.map((item, index) => {
      if (item.index !== index) {
        return { ...item, index };
      } else return item;
    });
  }

  createEmptyRow(sampleRow: any, index: any) {
    const newItem = {
      id: generateGuidId(),
      index: index,
      action: { type: "action", value: "add" },
    };

    let dummyRow = {};

    Object.keys(sampleRow).forEach((key: any) => {
      if (typeof sampleRow[key] == "object") {
        const { ["value"]: omitted, ...rest } = sampleRow[key];
        dummyRow[key] = rest;
      } else dummyRow[key] = sampleRow[key];
    });

    dummyRow = { ...dummyRow, ...newItem };

    return dummyRow;
  }

  getElementStyle(width: any) {
    return { width: `${width}%` };
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.container.data.indexOf(event.item.data),
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousContainer.data.indexOf(event.item.data),
        event.currentIndex
      );
    }

    console.log(event.container.data);
    this.dataSource = event.container.data;

    this.dataSource = this.updateIndexes(this.dataSource);

    this.table.renderRows();
  }
}
