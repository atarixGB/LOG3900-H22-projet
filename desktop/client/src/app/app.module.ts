import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ConfigPanelComponent } from './components/config-panel/config-panel.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NewDrawModalComponent } from './components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from './components/save-drawing-modal/save-drawing-modal.component';
import { EllipseConfigComponent } from './components/sidebar/ellipse-config/ellipse-config.component';
import { EraserConfigComponent } from './components/sidebar/eraser-config/eraser-config.component';
import { FileMenuComponent } from './components/sidebar/file-menu/file-menu.component';
import { PencilConfigComponent } from './components/sidebar/pencil-config/pencil-config.component';
import { PolygonConfigComponent } from './components/sidebar/polygon-config/polygon-config.component';
import { RectangleConfigComponent } from './components/sidebar/rectangle-config/rectangle-config.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolsListComponent } from './components/sidebar/tools-list/tools-list.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        FileMenuComponent,
        ToolsListComponent,
        PencilConfigComponent,
        EraserConfigComponent,
        PencilConfigComponent,
        NewDrawModalComponent,
        EllipseConfigComponent,
        RectangleConfigComponent,
        ConfigPanelComponent,
        ExportModalComponent,
        PolygonConfigComponent,
        SaveDrawingModalComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatGridListModule,
        MatTooltipModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatSliderModule,
        MatSelectModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatCheckboxModule,
    ],
    entryComponents: [],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
