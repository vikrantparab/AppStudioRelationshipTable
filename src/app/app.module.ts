import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AppComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatTableModule } from "@angular/material/table";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { MatButtonModule } from "@angular/material/button";
import { FloaraEditorDialog } from "./Components/FloaraEditorDialog/floara-editor-dialog.component";
import { ItemDialog } from "./Components/ItemContorl/item-control";
import { FormsModule } from "@angular/forms";
import { TextInputComponent } from "./shared/text-input/text-input.component";
import { SelectInputComponent } from "./shared/select-input/select-input.component";
import { ImageRendererComponent } from "./shared/image-renderer/image-renderer.component";

@NgModule({
  declarations: [
    AppComponent,
    FloaraEditorDialog,
    ItemDialog,
    TextInputComponent,
    SelectInputComponent,
    ImageRendererComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatTableModule,
    DragDropModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
