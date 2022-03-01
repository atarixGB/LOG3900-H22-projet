import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumGalleryComponent } from '@app/components/album-gallery/my-albums/album-gallery.component';
import { PublicAlbumsComponent } from './components/album-gallery/public-albums/public-albums.component';
import { PublicDrawingGalleryComponent } from './components/album-gallery/public-drawing-gallery/public-drawing-gallery.component';
import { ChatMenuComponent } from './components/chat/chat-menu/chat-menu.component';
import { ChatroomComponent } from './components/chat/chatroom/chatroom.component';
import { EditorComponent } from './components/editor/editor.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'chatroom', component: ChatroomComponent },
    { path: 'chatmenu', component: ChatMenuComponent },
    { path: 'my-albums', component: AlbumGalleryComponent },
    { path: 'all-albums', component: PublicAlbumsComponent },
    { path: 'public-gallery', component: PublicDrawingGalleryComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
