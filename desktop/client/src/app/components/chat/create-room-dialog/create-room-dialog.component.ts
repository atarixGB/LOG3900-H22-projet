import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { ChatService } from '@app/services/chat/chat.service';
import { NewRoomErrorSnackbarComponent } from './new-room-error-snackbar/new-room-error-snackbar.component';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {
  chatroomName: string;

  constructor(public chatService: ChatService, private snackbar: MatSnackBar,) {
    this.chatroomName = "";
   }

  createChatroom(): void {

    if (this.isValidInput(this.chatroomName) && this.chatroomName.length < NAME_MAX_LENGTH && this.isNotInDb(this.chatroomName)) {
      this.chatService.createRoom(this.chatroomName);
      setTimeout(() => {
        this.chatService.myRooms = [];
        this.chatService.getAllRooms(true);
      }, 200);
      
    } else {
      this.snackbar.openFromComponent( NewRoomErrorSnackbarComponent,{
        duration: 5 * 1000,
      })
    }
  }

  private isNotInDb(str: string): boolean {
    for (let room of this.chatService.myRooms) {
      if (str == room.roomName) {
        return false;
      }
    }
    return true;
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }



}
