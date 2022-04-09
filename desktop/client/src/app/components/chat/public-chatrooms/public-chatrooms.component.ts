import { Component, HostListener, OnInit } from '@angular/core';
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
  searchBarInput: string;

  constructor(public chatService: ChatService, public dialog : MatDialog) {
    this.chatService.filterActivated = false;
  }

  ngOnInit(): void {
    this.chatService.getAllRooms(false);
  }

  ngOnDestroy(): void {
    this.chatService.publicRooms = [];
    this.chatService.myRooms = [];
  }

  @HostListener('document:keyup.enter', ['$event'])
  onSearchBtn(): void {
    this.chatService.findRoomByRoomName(this.searchBarInput);
  }

  onCancelFilteringBtn(): void {
    this.searchBarInput = "";
    this.chatService.filterActivated = false;
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
