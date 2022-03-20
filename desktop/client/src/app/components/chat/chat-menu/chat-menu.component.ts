import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomDialogComponent } from '@app/components/chat/create-room-dialog/create-room-dialog.component'
import { DeleteRoomDialogComponent } from '@app/components/chat/delete-room-dialog/delete-room-dialog.component'
import { IChatroom } from '@app/interfaces-enums/IChatroom';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss'],
})
export class ChatMenuComponent implements OnInit {

  constructor(public loginService: LoginService, public chatService: ChatService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.chatService.getAllRooms(true);
  }

  ngOnDestroy(): void {
    this.chatService.publicRooms = [];
    this.chatService.myRooms= [];
  }

  onCreateNewChatroom(): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnDestroy();
        this.ngOnInit();
      }
    })
  }

  onOpenDefaultPublicRoom(): void {
    this.chatService.username = this.loginService.username;
    this.chatService.currentRoom = {
      identifier: "SYSTEM",
      roomName: "default-public-room",
      usersList: []
    }
    this.chatService.joinRoom(this.chatService.currentRoom.roomName);
  }

  onOpenChatroom(selectedRoom: IChatroom): void {
    this.chatService.username = this.loginService.username;
    this.chatService.currentRoom = selectedRoom;
    this.chatService.joinRoom(this.chatService.currentRoom.roomName);
  }

  onLeaveChatroom(selectedRoom: IChatroom): void {
    console.log("LEAVING ROOM", selectedRoom);
  }

  onDeleteChatroom(selectedRoom: IChatroom): void {
    const dialogRef = this.dialog.open(DeleteRoomDialogComponent, {
      data: selectedRoom
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnDestroy();
        this.ngOnInit();
      }
    })
  }
}
