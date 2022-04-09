import { formatDate } from '@angular/common';
import { AfterViewInit, Component, HostBinding, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { IMessage } from '@app/interfaces-enums/IMessage';
import { ChatService } from '@app/services/chat/chat.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';
import { LoginService } from '@app/services/login/login.service';
import { ChatroomUsersDialogComponent } from './chatroom-users-dialog/chatroom-users-dialog.component';
import { DeleteRoomDialogComponent } from './delete-room-dialog/delete-room-dialog.component';
import { LeaveRoomDialogComponent } from './leave-room-dialog/leave-room-dialog.component';
import { ProfileService } from '@app/services/profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PUBLIC_CHATROOM } from '@app/constants/constants';
import { ChatTheme, DARK_THEME, DEFAULT_THEME, IChatTheme, MINECRAFT_THEME } from '@app/constants/chat-themes';
import { ProfileSettingsService } from '@app/services/profile/profile-settings.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements AfterViewInit {
  userName: string;
  message: string;
  timestamp: any;
  messageList: IMessage[];
  userList: string[];
  socket: any;

  currentRoom: IChatroom;
  isCurrentChatroomMine: boolean;
  isPublicChatroom: boolean;

  displayedRoomName: string;

  constructor(
    public chatService: ChatService,
    public loginService: LoginService,
    public profileService: ProfileService,
    public dialog: MatDialog,
    public profileSettingsService: ProfileSettingsService,
    private soundEffectsService: SoundEffectsService,
    private router: Router,
    private route: ActivatedRoute) {
    this.userName = '';
    this.message = '';
    this.messageList = [];
    this.userList = [];
    this.socket = this.chatService.socket;
    this.currentRoom = this.chatService.currentRoom;
    this.isCurrentChatroomMine = this.chatService.currentRoom.identifier == loginService.username;
    this.isPublicChatroom = this.currentRoom.roomName == 'default-public-room';
    this.displayedRoomName = this.currentRoom.roomName == "default-public-room" ? "Canal public" : this.currentRoom.roomName;
    this.changeTheme(this.profileSettingsService.currentChatThemeId);

  }

  ngAfterViewInit(): void {
    this.userName = this.chatService.username;
    this.onNewMessage();
  }

  sendMessage(): void {
    if (!this.isEmptyOrSpaces(this.message)) {
      const data = {
        message: this.message,
        userName: this.userName,
        room: this.currentRoom.roomName,
        time: formatDate(new Date(), 'hh:mm:ss a', 'en-US'),
      };

      console.log("TO SERVER:", data);

      this.socket.emit('message', data);
      this.message = '';
      this.soundEffectsService.playSendMsgSound();
    }
    this.refocusMsgInputField();
  }

  onNewMessage(): void {
    this.timestamp = formatDate(new Date(), 'hh:mm:ss a', 'en-US');

    this.socket.on('message', (data: any) => {

      if (data) {
        console.log("FROM SERVER", data);

        const isMine = data.userName == this.userName;

        // This condition is a workaround to not display messages sent from the default public channel in other rooms... Not final code, the problem is still not fixed!
        if (data.room == this.chatService.currentRoom.roomName) {
          this.messageList.push({
            message: data.message,
            userName: data.userName,
            mine: isMine,
          });
        }
      }

      this.scrollToBottom();
    });
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
    this.dialog.open(ChatroomUsersDialogComponent, {
      data: this.chatService.currentRoom
    })

  }

  leaveChatroom(): void {
    this.dialog.open(LeaveRoomDialogComponent, {
      data: this.chatService.currentRoom
    });
  }

  deleteChatroom(): void {
    this.dialog.open(DeleteRoomDialogComponent, {
      data: this.chatService.currentRoom
    });
  }

  getUserProfileInfos(username: string): void {
    if (username != PUBLIC_CHATROOM.owner) {
      console.log("Get info of", username);
      this.router.navigate([`../profile/${username}`], { relativeTo: this.route });
    }
  }

  // **********************************
  // ******* Chat Customization *******
  // **********************************

  @HostBinding("style.--font") font: string;
  @HostBinding("style.--textColor") textColor: string;
  @HostBinding("style.--backgroundColor") backgroundColor: string;
  @HostBinding("style.--backgroundImage") backgroundImage: string;
  @HostBinding("style.--backgroundColorMainMessageContainer") backgroundColorMainMessageContainer: string;
  @HostBinding("style.--backgroundColorSecondMessageContainer") backgroundColorSecondMessageContainer: string;
  @HostBinding("style.--opacityMainContainer") opacityMainContainer: string;
  @HostBinding("style.--opacitySecondContainer") opacitySecondContainer: string;
  @HostBinding("style.--borderColor") borderColor: string;
  @HostBinding("style.--messageColorMine") messageColorMine: string;
  @HostBinding("style.--messageBackgroundMine") messageBackgroundMine: string;
  @HostBinding("style.--messageColorYours") messageColorYours: string;
  @HostBinding("style.--messageBackgroundYours") messageBackgroundYours: string;

  private changeTheme(themeId: ChatTheme) : void {
    switch (themeId) {
      case ChatTheme.Dark :
        this.setTheme(DARK_THEME);
        break;
      case ChatTheme.Minecraft :
        this.setTheme(MINECRAFT_THEME);
        break;
      default:
        this.setTheme(DEFAULT_THEME);
        break;
    }
  }

  private setTheme(theme: IChatTheme): void {
    this.font = theme.font;
    this.textColor = theme.textColor;
    this.backgroundColor = theme.backgroundColor;
    this.backgroundImage = theme.backgroundImage;
    this.backgroundColorMainMessageContainer = theme.backgroundColorMainMessageContainer;
    this.backgroundColorSecondMessageContainer = theme.backgroundColorSecondMessageContainer;
    this.opacityMainContainer = theme.opacityMainContainer;
    this.opacitySecondContainer = theme.opacitySecondContainer;
    this.borderColor = theme.borderColor;
    this.messageColorMine = theme.messageColorMine;
    this.messageBackgroundMine = theme.messageBackgroundMine;
    this.messageColorYours = theme.messageColorYours;
    this.messageBackgroundYours = theme.messageBackgroundYours;
  }

}
