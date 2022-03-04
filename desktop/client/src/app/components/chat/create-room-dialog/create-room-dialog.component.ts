import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent implements OnInit {
  chatroomName: string;

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
  }

  createChatroom(): void {
    console.log(`Creating chatroom... "${this.chatroomName}"`);

  }

}
