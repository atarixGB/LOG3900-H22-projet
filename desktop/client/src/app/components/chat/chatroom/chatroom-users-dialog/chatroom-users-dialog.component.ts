import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { ChatService } from '@app/services/chat/chat.service';
import { ProfileService } from '@app/services/profile/profile.service';
import { PUBLIC_CHATROOM } from '@app/constants/constants'
import { AdvancedResearchService } from '@app/services/advanced-research/advanced-research.service';

@Component({
  selector: 'app-chatroom-users-dialog',
  templateUrl: './chatroom-users-dialog.component.html',
  styleUrls: ['./chatroom-users-dialog.component.scss']
})
export class ChatroomUsersDialogComponent implements OnInit {
  isPublicChatroom: boolean;
  usersInPublicChatroom: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IChatroom,
    public chatService: ChatService,
    public profileService: ProfileService,
    public advancedResearchService: AdvancedResearchService,
    private currentDialogRef: MatDialogRef<ChatroomUsersDialogComponent>,
    private router: Router,
    private route: ActivatedRoute) {
    this.isPublicChatroom = this.chatService.currentRoom.roomName == PUBLIC_CHATROOM.name;
    this.usersInPublicChatroom = [];
    console.log(this.isPublicChatroom)
  }

  ngOnInit(): void {
    this.chatService.getAllUsers();
  }

  getUserProfileInfos(username:string): void {
    console.log("Get info of", username);
    this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
    this.currentDialogRef.close();
  }

}
