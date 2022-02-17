import { formatDate } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { IMessage } from '../../../interfaces-enums/IMessage';
import { LoginService } from '../../../services/login.service';

@Component({
    selector: 'app-chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements AfterViewInit {
    userName = '';
    message = '';
    messageList: IMessage[] = [];
    userList: string[] = [];
    socket: any;

    constructor(public loginService: LoginService) {
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
        });
    }

    isEmptyOrSpaces(str: string): boolean {
        return str === null || str.match(/^ *$/) !== null;
    }

    @HostListener('document:keyup.enter', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        this.sendMessage();
        var inputField = document.getElementById("msgInput");
        if (inputField) inputField.focus();
    }
}
