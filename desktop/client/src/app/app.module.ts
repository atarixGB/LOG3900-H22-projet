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
import { ConfigPanelComponent } from './components/editor/config-panel/config-panel.component';
import { DrawingComponent } from './components/editor/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportModalComponent } from './components/editor/export-modal/export-modal.component';
import { NewDrawModalComponent } from './components/editor/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from './components/editor/save-drawing-modal/save-drawing-modal.component';
import { EllipseConfigComponent } from './components/editor/sidebar/ellipse-config/ellipse-config.component';
import { EraserConfigComponent } from './components/editor/sidebar/eraser-config/eraser-config.component';
import { FileMenuComponent } from './components/editor/sidebar/file-menu/file-menu.component';
import { PaintConfigComponent } from './components/editor/sidebar/paint-config/paint-config.component';
import { PencilConfigComponent } from './components/editor/sidebar/pencil-config/pencil-config.component';
import { PolygonConfigComponent } from './components/editor/sidebar/polygon-config/polygon-config.component';
import { RectangleConfigComponent } from './components/editor/sidebar/rectangle-config/rectangle-config.component';
import { SidebarComponent } from './components/editor/sidebar/sidebar.component';
import { ToolsListComponent } from './components/editor/sidebar/tools-list/tools-list.component';
import { LoginComponent } from './components/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChatMenuComponent } from './components/chat/chat-menu/chat-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { SideMenuComponent } from './components/menu/side-menu/side-menu.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AlbumGalleryComponent } from './components/album-gallery/album-gallery.component';
import { CreateAlbumDialogComponent } from './components/album-gallery/create-album-dialog/create-album-dialog.component';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
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
        PaintConfigComponent,
        LoginComponent,
        ChatMenuComponent,
        MenuComponent,
        SideMenuComponent,
        SignUpComponent,
        AlbumGalleryComponent,
        CreateAlbumDialogComponent,
        ChatroomComponent
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
        FlexLayoutModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
