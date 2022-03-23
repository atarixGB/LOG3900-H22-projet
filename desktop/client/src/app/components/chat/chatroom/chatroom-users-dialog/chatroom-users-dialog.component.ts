import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IChatroom } from '@app/interfaces-enums/IChatroom';

@Component({
  selector: 'app-chatroom-users-dialog',
  templateUrl: './chatroom-users-dialog.component.html',
  styleUrls: ['./chatroom-users-dialog.component.scss']
})
export class ChatroomUsersDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IChatroom) { }

  ngOnInit(): void {
  }

}
