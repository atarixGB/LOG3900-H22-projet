import { Component } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {
  chatroomName: string;

  constructor(public chatService: ChatService) { }

  createChatroom(): void {
    this.chatService.createRoom(this.chatroomName);
  }

}
