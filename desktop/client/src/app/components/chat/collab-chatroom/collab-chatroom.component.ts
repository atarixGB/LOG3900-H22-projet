import { formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IMessage } from '@app/interfaces-enums/IMessage';
import { ChatService } from '@app/services/chat/chat.service';
import { CollabChatService } from '@app/services/chat/collab-chat.service';
import { ProfileService } from '@app/services/profile/profile.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';
import { ChatroomUsersDialogComponent } from '../chatroom/chatroom-users-dialog/chatroom-users-dialog.component';

@Component({
  selector: 'app-collab-chatroom',
  templateUrl: './collab-chatroom.component.html',
  styleUrls: ['./collab-chatroom.component.scss']
})
export class CollabChatroomComponent implements AfterViewInit {
  userName: string | null;
  message: string;
  timestamp: any;
  messageList: IMessage[];
  userList: string[];

  drawingName: string | null;

  constructor(
    public chatService: ChatService,
    public profileService: ProfileService,
    public dialog: MatDialog,
    private soundEffectsService: SoundEffectsService,
    private collabChatService: CollabChatService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.userName = '';
      this.message = '';
      this.messageList = [];
      this.userList = [];
      this.drawingName = '';

      this.collabChatService.newCollabMsg$.subscribe((msg: any) => {
        this.onNewMessage(msg);
      });

      this.collabChatService.updateUserList$.subscribe((userList: string[]) => {
        this.userList = userList;
      });
  }

  ngAfterViewInit(): void {
      this.userName = window.localStorage.getItem("username");
      this.drawingName = window.localStorage.getItem("currentDrawingName");
      this.collabChatService.connectSocketToCollabServer(window.localStorage.getItem("collabChatRoom") as string);
  }

  sendMessage(): void {
      if (!this.isEmptyOrSpaces(this.message)) {
          this.collabChatService.sendCollabMessage({
            message: this.message,
            userName: this.userName,
            room: '',
            time: formatDate(new Date(), 'hh:mm:ss a', 'en-US'),
          });
          this.message = '';
          this.soundEffectsService.playSendMsgSound();
      }
      this.refocusMsgInputField();
  }

  onNewMessage(msg: any): void {
    const isMine = msg.userName == this.userName;
    this.messageList.push({
        message: msg.message,
        userName: msg.userName,
        time: msg.time,
        mine: isMine,
    });
    this.scrollToBottom();
  }

  isEmptyOrSpaces(str: string): boolean {
      return str === null || str.match(/^ *$/) !== null;
  }

  @HostListener('document:keyup.enter', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
      this.sendMessage();
  }

  scrollToBottom(): void {
      setTimeout(() => {
          // We have to wait for the view to update with the new message before we can scroll to the bottom
          const msgsDiv = document.getElementById('messagesContainer');
          if (msgsDiv) {
              msgsDiv.scrollTop = msgsDiv.scrollHeight;
          }
      }, 50);
  }

  refocusMsgInputField(): void {
      const inputField = document.getElementById('msgInput');
      if (inputField) inputField.focus();
  }

  viewUsers(): void {
    const room = {
      identifier: '',
      roomName: this.drawingName,
      usersList: this.userList
    };
    this.dialog.open(ChatroomUsersDialogComponent, {
      data: room
    })
  }

  getUserProfileInfos(username: string): void {
      console.log("Get info of", username);
      this.profileService.viewProfile(this.router.url);
      console.log(this.router.url);
      
      this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
  }
}
