import { Injectable } from '@angular/core';
import { ICollabSelection } from '@app/interfaces-enums/ICollabSelection';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;

    newStroke: Subject<any>;
    newStroke$: Observable<any>;

    newSelection: Subject<any>;
    newSelection$: Observable<any>;

    newSelectionPos: Subject<any>;
    newSelectionPos$: Observable<any>;

    constructor(public drawingService: DrawingService) { 
        this.newStroke = new Subject();
        this.newStroke$ = this.newStroke.asObservable();

        this.newSelection = new Subject();
        this.newSelection$ = this.newSelection.asObservable();

        this.newSelectionPos = new Subject();
        this.newSelectionPos$ = this.newSelectionPos.asObservable();
    }

    enterCollaboration(): void {
        this.socket = io.io('http://localhost:3002/', { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: any) => {
            if (stroke.sender !== this.socket.id) {
                this.newStroke.next(stroke); // this is an observable value that will be read by selection service
            }
        });

        this.socket.on('receiveSelection', (selection: any) => {
            if (selection.sender !== this.socket.id) {
                this.newSelection.next(selection); // this is an observable value that will be read by collab selection service
            }
        });

        this.socket.on('receiveSelectionPos', (selectionPos: any) => {
            if (selectionPos.sender !== this.socket.id) {
                this.newSelectionPos.next(selectionPos); // this is an observable value that will be read by collab selection service
            }
        });
    } 

    broadcastStroke(stroke: any): void {
        stroke.sender = this.socket.id;
        this.socket.emit('broadcastStroke', stroke);
    }

    broadcastSelection(selection: ICollabSelection): void {
        selection.sender = this.socket.id;
        this.socket.emit('broadcastSelection', selection);
    }

    broadcastSelectionPos(selectionPos: any): void {
        selectionPos.sender = this.socket.id;
        this.socket.emit('broadcastSelectionPos', selectionPos);
    }
}
