import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-delete-room-dialog',
  templateUrl: './delete-room-dialog.component.html',
  styleUrls: ['./delete-room-dialog.component.scss']
})
export class DeleteRoomDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IChatroom, public chatService: ChatService) { }

  ngOnInit(): void {
    console.log("DATA", this.data.usersList);
  }

  onDeleteChatroom(): void {
    this.chatService.deleteRoom(this.data.roomName);
  }

}
