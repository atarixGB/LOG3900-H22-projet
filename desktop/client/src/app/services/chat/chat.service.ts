import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';
import { CHAT_URL } from '@app/constants/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  username: string;
  socket: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

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

  disconnect(): void {
    this.socket.emit('disconnectUser', this.username);
    this.socket.disconnect();
  }

}
