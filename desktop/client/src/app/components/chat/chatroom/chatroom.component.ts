import { formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { IMessage } from '@app/interfaces-enums/IMessage';
import { LoginService } from '@app/services/login.service';

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

    constructor(public loginService: LoginService) {
        this.userName = '';
        this.message = '';
        this.messageList = [];
        this.userList = [];
        this.socket = this.loginService.socket;
    }

    ngAfterViewInit(): void {
        this.userName = this.loginService.username;
        this.onNewMessage();
    }

    sendMessage(): void {
        if (!this.isEmptyOrSpaces(this.message)) {
            const data = {
                message: this.message,
                userName: this.userName,
                time: formatDate(new Date(), 'hh:mm:ss a', 'en-US'),
            };

            this.socket.emit('message', data);
            this.message = '';
        }
        this.refocusMsgInputField();
    }

    onNewMessage(): void {
        this.socket.on('message', (data: any) => {
            if (data) {
                let isMine = data.userName == this.userName;
                this.messageList.push({
                    message: data.message,
                    userName: data.userName + (isMine ? ' (moi)' : '') + ' - ' + formatDate(new Date(), 'hh:mm:ss a', 'en-US'),
                    mine: isMine,
                });
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
            if (msgsDiv) msgsDiv.scrollTop = msgsDiv.scrollHeight;
        }, 50);
    }

    refocusMsgInputField(): void {
        const inputField = document.getElementById('msgInput');
        if (inputField) inputField.focus();
    }
}
