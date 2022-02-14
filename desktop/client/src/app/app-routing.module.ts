import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';
import { EditorComponent } from './components/editor/editor.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LoginComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'chatroom', component: ChatroomComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
