import { Component } from '@angular/core';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {
  chatroomName: string;

  constructor(public chatService: ChatService) {
    this.chatroomName = "";
   }

  createChatroom(): void {

    if (this.isValidInput(this.chatroomName) && this.chatroomName.length < NAME_MAX_LENGTH) {
      this.chatService.createRoom(this.chatroomName);
      setTimeout(() => {
        this.chatService.myRooms = [];
        this.chatService.getAllRooms(true);
      }, 200);
      
    } else {
      // TODO: UI feedback. Following line is temporary
      alert("Le nom de la conversation doit avoir un nom et posséder moins de 40 caractères.");
    }
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }

}
