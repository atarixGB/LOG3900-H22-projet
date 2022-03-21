import { formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IChatroom } from '@app/interfaces-enums/IChatroom';
import { IMessage } from '@app/interfaces-enums/IMessage';
import { ChatService } from '@app/services/chat/chat.service';
import { LoginService } from '@app/services/login/login.service';
import { ChatroomUsersDialogComponent } from './chatroom-users-dialog/chatroom-users-dialog.component';
import { DeleteRoomDialogComponent } from './delete-room-dialog/delete-room-dialog.component';
import { LeaveRoomDialogComponent } from './leave-room-dialog/leave-room-dialog.component';

@Component({
    selector: 'app-chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements AfterViewInit {
    userName: string;
    message: string;
    messageList: IMessage[];
    userList: string[];
    socket: any;

    currentRoom: IChatroom;
    isCurrentChatroomMine: boolean;

    constructor(public chatService: ChatService, public loginService: LoginService, public dialog: MatDialog) {
        this.userName = '';
        this.message = '';
        this.messageList = [];
        this.userList = [];
        this.socket = this.chatService.socket;
        this.currentRoom = this.chatService.currentRoom;
        this.isCurrentChatroomMine = this.chatService.currentRoom.identifier == loginService.username;
        console.log(`current room mine? ${this.isCurrentChatroomMine}`);

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
        }
        this.refocusMsgInputField();
    }

    onNewMessage(): void {
        this.socket.on('message', (data: any) => {

            if (data) {
              console.log("FROM SERVER", data);

                const isMine = data.userName == this.userName;

                // This condition is a workaround to not display messages sent from the default public channel in other rooms... Not final code, the problem is still not fixed!
                if (data.room == this.chatService.currentRoom.roomName) {
                  this.messageList.push({
                      message: data.message,
                      userName: data.userName + ' - ' + formatDate(new Date(), 'hh:mm:ss a', 'en-US'),
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
}
