import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';
import { CHAT_URL } from '@app/constants/api-urls';
import { HttpClient } from '@angular/common/http';
import { CHATROOM_URL } from '@app/constants/api-urls';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  username: string;
  socket: any;

  constructor(private loginService: LoginService, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) { }

  connectUser(): void {
    // this.socket = io.io('https://polygram-app.herokuapp.com/', { transports: ['websocket'] });
    this.socket = io.io(CHAT_URL, { transports: ['websocket'] });

    this.socket.emit('newUser', this.username);

    this.socket.on('newUser', (user: string) => {

      if (this.username == user) {
        this.router.navigate(['../chatroom'], { relativeTo: this.route });
      }
    });
  }

  createRoom(roomName: string): void {
    const chatroomData = {
      roomName: roomName,
      identifier: this.loginService.username,
      usersList: [this.loginService.username]
    }

    console.log("chatroomData:", chatroomData);

    this.httpClient.post(CHATROOM_URL, chatroomData).subscribe(
      (result) => {
        console.log("Server result:", result);
      },
      (error) => {
        console.log("Server error:", error);
      });
  }

  disconnect(): void {
    this.socket.emit('disconnectUser', this.username);
    this.socket.disconnect();
  }

}
