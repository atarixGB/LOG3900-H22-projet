import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomDialogComponent } from '@app/components/chat/create-room-dialog/create-room-dialog.component'
import { IChatroom } from '@app/interfaces-enums/IChatroom';

@Component({
    selector: 'app-chat-menu',
    templateUrl: './chat-menu.component.html',
    styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit {
    constructor(private loginService: LoginService, public chatService: ChatService,  public dialog: MatDialog) {}

    ngOnInit(): void {
      this.chatService.getAllRooms(true);
    }

    ngOnDestroy():  void {
      this.chatService.publicRooms = [];
    }

    openCreateChatroomDialog(): void {
      const dialogRef = this.dialog.open(CreateRoomDialogComponent);
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        this.ngOnDestroy();
        this.ngOnInit();
      })
      console.log("open Create Chatroom Dialog");
    }

    joinDefaultChannel(): void {
        this.chatService.username = this.loginService.username;
        this.chatService.connectUser();
    }

    onChatroomClick(selectedRoom: IChatroom): void {
      console.log(`ROOM: ${selectedRoom.roomName}\nCREATOR: ${selectedRoom.identifier}\nID: ${selectedRoom._id}\nMEMBERS: ${selectedRoom.usersList}`);
    }
}
