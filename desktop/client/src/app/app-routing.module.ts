import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatMenuComponent } from './components/chat/chat-menu/chat-menu.component';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';
import { EditorComponent } from './components/editor/editor.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'chatroom', component: ChatroomComponent },
    { path: 'chatmenu', component: ChatMenuComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'profileSettings', component: ProfileSettingsComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
