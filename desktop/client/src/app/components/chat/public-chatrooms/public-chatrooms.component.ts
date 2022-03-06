import { Component, OnInit } from '@angular/core';
import { ChatService } from '@app/services/chat/chat.service';
import { IChatroom } from '@app/interfaces-enums/IChatroom'

@Component({
  selector: 'app-public-chatrooms',
  templateUrl: './public-chatrooms.component.html',
  styleUrls: ['./public-chatrooms.component.scss']
})
export class PublicChatroomsComponent implements OnInit {

  constructor(public chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.getAllRooms(false);
  }

  ngOnDestroy(): void {
    this.chatService.publicRooms = [];
  }

  onChatroomClick(selectedRoom: IChatroom): void {
    console.log(`ROOM: ${selectedRoom.roomName}\nCREATOR: ${selectedRoom.identifier}\nID: ${selectedRoom._id}\nMEMBERS: ${selectedRoom.usersList}`);
  }

}
