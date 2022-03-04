import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';
import { CHAT_URL } from '@app/constants/api-urls';
import { HttpClient } from '@angular/common/http';
import { CREATE_ROOM_URL, ALL_ROOMS_URL } from '@app/constants/api-urls';
import { LoginService } from '../login/login.service';
import { IChatroom } from '@app/interfaces-enums/IChatroom'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  username: string;
  socket: any;
  publicRooms: IChatroom[];

  constructor(private loginService: LoginService, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.username = "";
    this.publicRooms = [];
  }

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

    this.httpClient.post(CREATE_ROOM_URL, chatroomData).subscribe(
      (result: IChatroom) => {
        console.log("Server result:", result);
      },
      (error) => {
        console.log("Server error:", error);
      });
  }

  getAllRooms(): void {
    this.httpClient.get<IChatroom[]>(ALL_ROOMS_URL).subscribe(
      (chatrooms: IChatroom[]) => {
        for (let i = 0; i < chatrooms.length; i++) {
          this.publicRooms.push(chatrooms[i]);
          console.log(this.publicRooms[i]);
        }
      }
      ,
      (error: any) => {
        console.log(`Impossible de retrouver les conversations publiques dans la base de données\nErreur: ${error}`);
      }
    )
  }

  disconnect(): void {
    this.socket.emit('disconnectUser', this.username);
    this.socket.disconnect();
  }

}
