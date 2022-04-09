import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule} from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './components/app/app.component';
import { AvatarImportModalComponent } from './components/avatar/avatar-import-modal/avatar-import-modal.component';
import { AvatarSelectionModalComponent } from './components/avatar/avatar-selection-modal/avatar-selection-modal.component';
import { ChatMenuComponent } from './components/chat/chat-menu/chat-menu.component';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';
import { ConfigPanelComponent } from './components/editor/config-panel/config-panel.component';
import { DrawingComponent } from './components/editor/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportModalComponent } from './components/editor/export-modal/export-modal.component';
import { SaveDrawingModalComponent } from './components/editor/save-drawing-modal/save-drawing-modal.component';
import { EllipseConfigComponent } from './components/editor/sidebar/ellipse-config/ellipse-config.component';
import { FileMenuComponent } from './components/editor/sidebar/file-menu/file-menu.component';
import { PencilConfigComponent } from './components/editor/sidebar/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from './components/editor/sidebar/rectangle-config/rectangle-config.component';
import { SidebarComponent } from './components/editor/sidebar/sidebar.component';
import { ToolsListComponent } from './components/editor/sidebar/tools-list/tools-list.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { SideMenuComponent } from './components/menu/side-menu/side-menu.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SelectionConfigComponent } from './components/editor/sidebar/selection-config/selection-config.component';
import { AlbumGalleryComponent } from './components/album-gallery/my-albums/album-gallery.component';
import { CreateAlbumDialogComponent } from './components/album-gallery/create-album-dialog/create-album-dialog.component';
import { PublicAlbumsComponent } from './components/album-gallery/public-albums/public-albums.component';
import { DrawingsViewComponent } from './components/album-gallery/drawings-view/drawings-view.component';
import { PublicDrawingGalleryComponent } from './components/album-gallery/public-drawing-gallery/public-drawing-gallery.component';
import { ColorConfigComponent } from './components/editor/sidebar/color-config/color-config.component';
import { CreateRoomDialogComponent } from './components/chat/create-room-dialog/create-room-dialog.component';
import { PublicChatroomsComponent } from './components/chat/public-chatrooms/public-chatrooms.component';
import { DeleteRoomDialogComponent } from './components/chat/chatroom/delete-room-dialog/delete-room-dialog.component';
import { CreateDrawingDialogComponent } from './components/editor/create-drawing-dialog/create-drawing-dialog.component';
import { RequestsDialogComponent } from './components/album-gallery/drawings-view/requests-dialog/requests-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JoinRoomDialogComponent } from './components/chat/public-chatrooms/join-room-dialog/join-room-dialog.component';
import { LeaveRoomDialogComponent } from './components/chat/chatroom/leave-room-dialog/leave-room-dialog.component';
import { ChatroomUsersDialogComponent } from './components/chat/chatroom/chatroom-users-dialog/chatroom-users-dialog.component';
import { MembersListDialogComponent } from './components/album-gallery/drawings-view/members-list-dialog/members-list-dialog.component';
import { AlbumSettingsDialogComponent } from './components/album-gallery/drawings-view/album-settings-dialog/album-settings-dialog.component';
import { JoinRequestDialogComponent } from './components/album-gallery/public-albums/join-request-dialog/join-request-dialog.component';
import { MemberJoinedDialogComponent } from './components/editor/member-joined-dialog/member-joined-dialog.component';
import { MemberLeftDialogComponent } from './components/editor/member-left-dialog/member-left-dialog.component';
import { FavoriteDrawingsComponent } from './components/profile/favorite-drawings/favorite-drawings.component';
import { TopDrawingsComponent } from './components/profile/top-drawings/top-drawings.component';
import { StoryComponent } from './components/story/story.component';
import { ChangeDrawingNameDialogComponent } from './components/album-gallery/drawings-view/change-drawing-name-dialog/change-drawing-name-dialog.component';
import { ChangeAlbumDialogComponent } from './components/album-gallery/drawings-view/change-album-dialog/change-album-dialog.component';
import { DeleteDrawingDialogComponent } from './components/album-gallery/drawings-view/delete-drawing-dialog/delete-drawing-dialog.component';
import { CollabChatroomComponent } from './components/chat/collab-chatroom/collab-chatroom.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        FileMenuComponent,
        ToolsListComponent,
        PencilConfigComponent,
        PencilConfigComponent,
        EllipseConfigComponent,
        RectangleConfigComponent,
        ConfigPanelComponent,
        ExportModalComponent,
        SaveDrawingModalComponent,
        LoginComponent,
        ChatMenuComponent,
        MenuComponent,
        SideMenuComponent,
        SignUpComponent,
        AlbumGalleryComponent,
        CreateAlbumDialogComponent,
        ChatroomComponent,
        PublicAlbumsComponent,
        DrawingsViewComponent,
        PublicDrawingGalleryComponent,
        AvatarSelectionModalComponent,
        AvatarImportModalComponent,
        ChatroomComponent,
        ProfileComponent,
        ProfileSettingsComponent,
        SelectionConfigComponent,
        ColorConfigComponent,
        CreateRoomDialogComponent,
        PublicChatroomsComponent,
        DeleteRoomDialogComponent,
        CreateDrawingDialogComponent,
        RequestsDialogComponent,
        DashboardComponent,
        JoinRoomDialogComponent,
        LeaveRoomDialogComponent,
        ChatroomUsersDialogComponent,
        MembersListDialogComponent,
        AlbumSettingsDialogComponent,
        JoinRequestDialogComponent,
        MemberJoinedDialogComponent,
        MemberLeftDialogComponent,
        FavoriteDrawingsComponent,
        TopDrawingsComponent,
        StoryComponent,
        ChangeDrawingNameDialogComponent,
        ChangeAlbumDialogComponent,
        DeleteDrawingDialogComponent,
        CollabChatroomComponent,
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
        MatProgressBarModule,
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
        MaterialFileInputModule,
        MatMenuModule,
        MatCardModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
