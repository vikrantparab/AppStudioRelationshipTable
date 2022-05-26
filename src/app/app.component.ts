import { Component, OnInit, ViewChild } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { random } from "lodash";
import { MatSort, Sort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { FloaraEditorDialog } from "./Components/FloaraEditorDialog/floara-editor-dialog.component";
import { ItemDialog } from "./Components/ItemContorl/item-control";
import * as tableConfig from "../assets/Table.json";
import * as tableDataArray from "../assets/DataArray.json";
import * as relMetadata from "../assets/RelationshipMetaData.json";
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
  displayedColumns: string[] = [];
  displayedColumnsLabels: any = {};
  dataSourceModel: any = {};
  dataSource = [];
  rootDataSource: any;
  newTableColumns: any;
  readOnly = true;
  ignoredProps = [
    "id",
    "action",
    "relatedItemId",
    "relationshipType",
    "relatedItemType",
  ];

  constructor(public dialog: MatDialog) {}

  onRichtextClick(obj, index) {
    const dialogRef = this.dialog.open(FloaraEditorDialog, {
      data: obj,
      width: "70%",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("res: ", result);
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
        let control = element.control;
        this.displayedColumns.push(control.name);
        this.displayedColumnsLabels[control.name] = control.label;
        this.dataSourceModel[control.name] = {
          type: control.type,
          dataType: control.dataType,
        };
      });
      this.displayedColumns.push("action");
      this.displayedColumnsLabels["action"] = "Actions";
      console.log(this.displayedColumns);

      this.TABLE_DATA_ARRAY.forEach((element) => {
        let dataSourceObj = {};
        if (element.properties) {
          let matchedKeys = Object.keys(element.properties).filter(
            (key) => this.displayedColumns.indexOf(key) != -1
          );
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
        dataSourceObj["relatedItemId"] = element.relatedItem.id;
        dataSourceObj["relationshipType"] = element.type;
        dataSourceObj["relatedItemType"] = element.relatedItem.type;
        dataSourceObj["readOnly"] = true;
        dataSourceObj["action"] = { type: "action" };
        console.log(dataSourceObj);
        if (Object.keys(dataSourceObj)) this.dataSource.push(dataSourceObj);
      });
    }

    this.rootDataSource = JSON.parse(JSON.stringify(this.dataSource));
  }

  dropTable(event: CdkDragDrop<string[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  toggleReadOnly(isReadOnly) {
    this.readOnly = isReadOnly;
    this.dataSource.forEach((item) => {
      item["readOnly"] = isReadOnly;
    });
    console.log(this.dataSource);
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
    this.table.renderRows();
  }

  onRowEditDone(element: any) {
    const updatedProps = {
      readOnly: true,
    };
    this.dataSource = this.updateDataSource(element, updatedProps);
    this.table.renderRows();
  }

  onRowDelete(element: any) {
    const updatedProps = { action: { ...element.action, value: "delete" } };
    this.dataSource = this.updateDataSource(element, updatedProps);
    this.table.renderRows();
  }

  updateDataSource(element: any, updatedProps: any) {
    const prevIndex = this.dataSource.findIndex((d) => d === element);
    this.dataSource.splice(prevIndex, 1);

    const updatedObject = { ...element, ...updatedProps };
    this.dataSource.splice(prevIndex, 0, updatedObject); // insert at specific index

    return this.dataSource;
  }

  saveRelationshipData() {
    var differentialDataSource = this.evaluateDifference();
    // Add a mapper to map dataSource to API response
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

    console.log(finalJson);
  }

  addNewItem() {
    const recordCount = this.dataSource.length;
    const existingIndex = random(0, recordCount - 1, false);
    const newItem: any = JSON.parse(
      JSON.stringify(this.dataSource[existingIndex])
    );
    this.dataSource = [
      ...this.dataSource,
      {
        ...newItem,
        id: generateGuidId(),
        index: recordCount,
        readOnly: true,
        action: { type: "action", value: "add" },
      },
    ];

    this.table.renderRows();
  }
}
