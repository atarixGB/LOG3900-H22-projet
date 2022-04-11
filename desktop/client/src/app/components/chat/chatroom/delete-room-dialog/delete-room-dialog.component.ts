import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { ChatService } from '@app/services/chat/chat.service';

@Component({
  selector: 'app-delete-room-dialog',
  templateUrl: './delete-room-dialog.component.html',
  styleUrls: ['./delete-room-dialog.component.scss']
})
export class DeleteRoomDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IChatroom, public chatService: ChatService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("DATA", this.data.usersList);
  }

  onDeleteChatroom(): void {
    this.chatService.deleteRoom(this.data.roomName);
    this.router.navigate(['../chatmenu'], { relativeTo: this.route });
    setTimeout(() => {
      this.chatService.myRooms = [];
      this.chatService.getAllRooms(true);
    }, 200);
  }

}
