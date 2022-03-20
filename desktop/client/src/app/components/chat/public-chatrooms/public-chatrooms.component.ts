import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';
import { IChatroom } from '@app/interfaces-enums/IChatroom'
import { MatDialog } from '@angular/material/dialog';
import { JoinRoomDialogComponent } from './join-room-dialog/join-room-dialog.component';

@Component({
  selector: 'app-public-chatrooms',
  templateUrl: './public-chatrooms.component.html',
  styleUrls: ['./public-chatrooms.component.scss']
})
export class PublicChatroomsComponent implements OnInit {

  constructor(public chatService: ChatService, public dialog : MatDialog) { }

  ngOnInit(): void {
    this.chatService.getAllRooms(false);
  }

  ngOnDestroy(): void {
    this.chatService.publicRooms = [];
    this.chatService.myRooms = [];
  }

  onChatroomClick(selectedRoom: IChatroom): void {
    const dialogRef = this.dialog.open(JoinRoomDialogComponent, {
      data: selectedRoom
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit()
    })
  }

}
