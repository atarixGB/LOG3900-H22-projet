import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/stroke';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;

    constructor() {}

    enterCollaboration(): void {
        this.socket = io.io('http://localhost:3002/', { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: string) => {
            console.log('Stroke received : ', stroke);
        });
    }

    broadcastStroke(stroke: Stroke): void {
      this.socket.emit('broadcastStroke', stroke);
    }
}
