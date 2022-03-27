import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { ProfileService } from '@app/services/profile/profile.service';

@Component({
  selector: 'app-chatroom-users-dialog',
  templateUrl: './chatroom-users-dialog.component.html',
  styleUrls: ['./chatroom-users-dialog.component.scss']
})
export class ChatroomUsersDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IChatroom, public profileService: ProfileService) { }

  ngOnInit(): void {
  }

  getUserProfileInfos(username:string): void {
    console.log("Get info of", username);
    this.profileService.getUserProfileInfos(username);
  }

}
