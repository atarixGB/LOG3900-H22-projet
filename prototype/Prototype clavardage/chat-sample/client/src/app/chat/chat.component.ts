import { formatDate } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import * as io from 'socket.io-client';
import { IMessage } from '../interfaces/IMessage';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewInit {
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
        time : formatDate(new Date(), 'hh:mm:ss a', 'en-US')
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

  isEmptyOrSpaces(str : string) : boolean {
    return str === null || str.match(/^ *$/) !== null;
  }
}
