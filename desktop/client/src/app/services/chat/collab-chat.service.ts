import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { COLLAB_URL } from '@app/constants/api-urls';

@Injectable({
    providedIn: 'root',
})
export class CollabChatService {
    socket: any;
    room: string | null;
    
    newCollabMsg: Subject<any>;
    newCollabMsg$: Observable<any>;

    constructor() { 
      this.newCollabMsg = new Subject();
      this.newCollabMsg$ = this.newCollabMsg.asObservable();
    }

    connectSocketToCollabServer(): void {
      this.socket = io.io(COLLAB_URL, { transports: ['websocket'] });
      
      this.socket.on('receiveCollabMessage', (msg: any) => {
          this.newCollabMsg.next(msg);
      });
    }

    joinCollabChat(room: string): void {
      console.log("JOINING room: ", room);
      this.room = room;
      
      this.socket.emit('joinCollabChat', room);
    }

    sendCollabMessage(msg: any): void {
      msg.room = this.room;
      this.socket.emit('collabMessage', msg);
    }

}

