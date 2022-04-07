import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';
import { CHAT_URL, JOIN_ROOM_URL, LEAVE_ROOM_URL } from '@app/constants/api-urls';
import { HttpClient } from '@angular/common/http';
import { CREATE_ROOM_URL, ALL_ROOMS_URL, DELETE_ROOM_URL } from '@app/constants/api-urls';
import { IChatroom } from '@app/interfaces-enums/IChatroom'

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket: any;
  username: string | null;
  publicRooms: IChatroom[];
  myRooms: IChatroom[];
  currentRoom: IChatroom;

  filteredRooms: IChatroom[];
  filterActivated: boolean;

  constructor( private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.username = window.localStorage.getItem("username");
    this.currentRoom = {
      identifier: '',
      roomName: '',
      usersList: []
    };
    this.publicRooms = [];
    this.myRooms = [];

    this.filteredRooms = [];
    this.filterActivated = false;
  }

  joinRoom(roomName: string): void {
    const data = {
      userName: this.username,
      room: roomName,
    }

    this.socket = io.io(CHAT_URL, { transports: ['websocket'] });

    this.socket.emit('newUser', data);

    this.socket.emit("joinRoom", data);

    this.socket.on('newUser', (user: string) => {
      if (this.username == user) {
        this.router.navigate(['../chatroom'], { relativeTo: this.route });
      }
    });
  }

  addRoomToMyList(roomName: IChatroom): void {
    const body = {
      user: window.localStorage.getItem("username"),
      roomName: roomName.roomName
    }

    this.httpClient.post(JOIN_ROOM_URL, body).subscribe(
      (result) => {
        console.log("Résultat du serveur:", result);
      },
      (error) => {
        console.log("Erreur du serveur:", error);
      });
  }

  createRoom(roomName: string): void {
    const chatroomData = {
      roomName: roomName,
      identifier: window.localStorage.getItem("username"),
      usersList: [window.localStorage.getItem("username")]
    }

    this.httpClient.post(CREATE_ROOM_URL, chatroomData).subscribe(
      (result) => {
        console.log(`La conversation "${roomName}" a été créée avec succès! Code:`, result);

        const data = {
          room: roomName,
          userName: window.localStorage.getItem("username"),
          usersList: [window.localStorage.getItem("username")]
        }

        this.socket = io.io(CHAT_URL, { transports: ['websocket'] });
        this.socket.emit("createRoom", data);
        this.socket.on("newRoomCreated", (result: any) => { console.log(result); })

      },
      (error) => {
        console.log(`Impossible de créer la conversation "${roomName}".\nErreur:`, error);
      });
  }

  getAllRooms(mineOnly: boolean): void {
    this.httpClient.get<IChatroom[]>(ALL_ROOMS_URL).subscribe(
      (chatrooms: IChatroom[]) => {

        for (let i = 0; i < chatrooms.length; i++) {

          // Filter current user's chatroom only (SUGGESTION: we should do the filtering on the server side)
          if (mineOnly) {
            if (chatrooms[i].usersList.includes(window.localStorage.getItem("username") as string)) {
              this.myRooms.push(chatrooms[i]);
            }
          } else {
            if (!chatrooms[i].usersList.includes(window.localStorage.getItem("username") as string)) {
              this.publicRooms.push(chatrooms[i]);
            }
          }

        }
      }
      ,
      (error: any) => {
        console.log(`Impossible de retrouver les conversations publiques dans la base de données\nErreur:`, error);
      }
    )
  }

  findRoomByRoomName(roomName: string): void {
    this.filteredRooms = [];
    this.filterActivated = true;
    for (let i = 0; i < this.publicRooms.length; i++) {
      if (this.publicRooms[i].roomName.includes(roomName)) {
        this.filteredRooms.push(this.publicRooms[i]);
      }
    }
  }

  deleteRoom(roomName: string): void {
    const data = {
      roomName: roomName
    }

    this.httpClient.post<number>(DELETE_ROOM_URL, data).subscribe(
      (result) => {
        if (result == 201) {
          console.log(`La conversation "${roomName}" a été supprimée avec succès! Code:`, result);
        } else {
          console.log(`La conversation "${roomName}" n'a pas pu être supprimée. Veuillez réessayer. Code: `, result);
        }
      },
      (error) => {
        console.log(`Impossible de supprimer la conversation "${roomName}".\nErreur:`, error);
      })
  }

  leaveRoom(roomName: string): void {
    const body = {
      user: window.localStorage.getItem("username"),
      roomName: roomName
    }

    this.httpClient.post(LEAVE_ROOM_URL, body).subscribe(
      (result) => {
        if (result == 201) {
          console.log(`L'utilisateur ${window.localStorage.getItem("username")} a quitté la conversation "${roomName}" avec succès! Code:`, result);
        } else {
          console.log(`L'utilisateur ${window.localStorage.getItem("username")} n'a pas pu quitter la conversation "${roomName}. Code:`, result);
        }
      },
      (error) => {
        console.log(`Impossible de supprimer la conversation "${roomName}".\nErreur:`, error);
      })
  }

  openChat(): any {
    electron.ipcRenderer.send("open-chat", null);
  }

  closeChat(): any {
    electron.ipcRenderer.send("close-chat", null);
  }

  disconnect(): void {
    this.socket.emit('disconnectUser', this.username);
    window.localStorage.removeItem("username");
    this.socket.disconnect();
  }

}
