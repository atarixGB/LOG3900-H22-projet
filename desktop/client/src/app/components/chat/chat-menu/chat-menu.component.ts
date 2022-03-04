import { Component } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomDialogComponent } from '@app/components/chat/create-room-dialog/create-room-dialog.component'

@Component({
    selector: 'app-chat-menu',
    templateUrl: './chat-menu.component.html',
    styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent {
    constructor(private loginService: LoginService, private chatService: ChatService,  public dialog: MatDialog) {}


    openCreateChatroomDialog(): void {
      this.dialog.open(CreateRoomDialogComponent)
      console.log("open Create Chatroom Dialog");

    }

    joinExistingChatroom(): void {
      // TODO
      console.log("Click on Join Existing Chatroom");
    }

    joinDefaultChannel(): void {
        this.chatService.username = this.loginService.username;
        this.chatService.connectUser();
    }
}
