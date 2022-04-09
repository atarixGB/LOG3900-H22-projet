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
    updateUserList: Subject<any>;
    updateUserList$: Observable<any>;

    doOnce: boolean;

    constructor() { 
      this.newCollabMsg = new Subject();
      this.newCollabMsg$ = this.newCollabMsg.asObservable();
      this.updateUserList = new Subject();
      this.updateUserList$ = this.updateUserList.asObservable();

      this.doOnce = true;
    }


    connectSocketToCollabServer(room: string): void {
      if (this.doOnce) {
        this.doOnce = false;
        this.socket = io.io(COLLAB_URL, { transports: ['websocket'] });
        
        this.socket.on('receiveCollabMessage', (msg: any) => {
            this.newCollabMsg.next(msg);
        });

        this.socket.on('updateUserList', (userList: string[]) => {
          this.updateUserList.next(userList);
        });

        this.room = room;
        this.socket.emit('joinCollabChat', room);
      }
    }

    sendCollabMessage(msg: any): void {
      msg.room = this.room;
      this.socket.emit('collabMessage', msg);
    }

}

