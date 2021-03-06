import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumGalleryComponent } from '@app/components/album-gallery/my-albums/album-gallery.component';
import { AdvancedResearchComponent } from './components/advanced-research/advanced-research.component';
import { DrawingsViewComponent } from './components/album-gallery/drawings-view/drawings-view.component';
import { PublicAlbumsComponent } from './components/album-gallery/public-albums/public-albums.component';
import { ChatMenuComponent } from './components/chat/chat-menu/chat-menu.component';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';
import { CollabChatroomComponent } from './components/chat/collab-chatroom/collab-chatroom.component';
import { PublicChatroomsComponent } from './components/chat/public-chatrooms/public-chatrooms.component';
import { EditorComponent } from './components/editor/editor.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { FavoriteDrawingsComponent } from './components/profile/favorite-drawings/favorite-drawings.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TopDrawingsComponent } from './components/profile/top-drawings/top-drawings.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component'
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'chatroom', component: ChatroomComponent },
    { path: 'collab-chatroom', component: CollabChatroomComponent },
    { path: 'chatmenu', component: ChatMenuComponent },
    { path: 'public-chatrooms', component: PublicChatroomsComponent },
    { path: 'my-albums', component: AlbumGalleryComponent },
    { path: 'all-albums', component: PublicAlbumsComponent },
    { path: 'drawing-view', component: DrawingsViewComponent },
    { path: 'profile/:username', component: ProfileComponent },
    { path: 'profileSettings', component: ProfileSettingsComponent },
    { path: 'favorite-drawings', component: FavoriteDrawingsComponent },
    { path: 'top-drawings', component: TopDrawingsComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'advanced-search', component: AdvancedResearchComponent },
    { path: '**', redirectTo: '/menu' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule],
})
export class AppRoutingModule {}
