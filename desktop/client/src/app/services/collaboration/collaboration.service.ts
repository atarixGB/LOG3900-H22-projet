import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class CollaborationService {

  socket: any;

  constructor() { }

  enterCollaboration() : void {
    this.socket = io.io(`http://localhost:3002/`, { transports: ['websocket'] });

    this.socket.on('receiveStroke', (stroke: string) => {
      console.log("Stroke received : ", stroke);
    });
  }
}
