import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { COLLAB_URL } from '@app/constants/api-urls';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;
    room: string;

    newStroke: Subject<any>;
    newStroke$: Observable<any>;

    newSelection: Subject<any>;
    newSelection$: Observable<any>;

    newSelectionPos: Subject<any>;
    newSelectionPos$: Observable<any>;

    newSelectionSize: Subject<any>;
    newSelectionSize$: Observable<any>;

    pasteRequest: Subject<any>;
    pasteRequest$: Observable<any>;

    deleteRequest: Subject<any>;
    deleteRequest$: Observable<any>;

    newStrokeWidth: Subject<any>;
    newStrokeWidth$: Observable<any>;

    newPrimaryColor: Subject<any>;
    newPrimaryColor$: Observable<any>;

    newSecondaryColor: Subject<any>;
    newSecondaryColor$: Observable<any>;

    newCollabData: Subject<any>;
    newCollabData$: Observable<any>;

    constructor(public drawingService: DrawingService) { 
        this.newStroke = new Subject();
        this.newStroke$ = this.newStroke.asObservable();

        this.newSelection = new Subject();
        this.newSelection$ = this.newSelection.asObservable();

        this.newSelectionPos = new Subject();
        this.newSelectionPos$ = this.newSelectionPos.asObservable();

        this.newSelectionSize = new Subject();
        this.newSelectionSize$ = this.newSelectionSize.asObservable();

        this.pasteRequest = new Subject();
        this.pasteRequest$ = this.pasteRequest.asObservable();

        this.deleteRequest = new Subject();
        this.deleteRequest$ = this.deleteRequest.asObservable();

        this.newStrokeWidth = new Subject();
        this.newStrokeWidth$ = this.newStrokeWidth.asObservable();

        this.newPrimaryColor = new Subject();
        this.newPrimaryColor$ = this.newPrimaryColor.asObservable();

        this.newSecondaryColor = new Subject();
        this.newSecondaryColor$ = this.newSecondaryColor.asObservable();

        this.newCollabData = new Subject();
        this.newCollabData$ = this.newCollabData.asObservable();
    }

    enterCollaboration(): void {
        this.socket = io.io(COLLAB_URL, { transports: ['websocket'] });

        this.socket.on('joinSuccessful', (collabData: any) => {
            this.newCollabData.next(collabData);
        });

        this.socket.on('joinFailure', () => {
            console.log('Couldnt join, already 4 members');
        });

        this.socket.on('receiveStroke', (stroke: any) => {
            this.newStroke.next(stroke);
        });

        this.socket.on('receiveSelection', (selection: any) => {
            this.newSelection.next(selection);
        });

        this.socket.on('receiveSelectionPos', (selectionPos: any) => {
            this.newSelectionPos.next(selectionPos);
        });

        this.socket.on('receiveSelectionSize', (selectionSize: any) => {
            this.newSelectionSize.next(selectionSize); 
        });

        this.socket.on('receivePasteRequest', (pasteReq: any) => {
            this.pasteRequest.next(pasteReq); 
        });

        this.socket.on('receiveDeleteRequest', (delReq: any) => {
            this.deleteRequest.next(delReq); 
        });

        this.socket.on('receiveStrokeWidth', (width: any) => {
            this.newStrokeWidth.next(width); 
        });

        this.socket.on('receiveNewPrimaryColor', (color: any) => {
            this.newPrimaryColor.next(color); 
        });

        this.socket.on('receiveNewSecondaryColor', (color: any) => {
            this.newSecondaryColor.next(color); 
        });
    } 

    // COLLAB ROOM EMITS
    joinCollab(drawingId: any): void {
        this.room = drawingId.replaceAll(/"/g, '');
        this.socket.emit('joinCollab', this.room);
    }

    leaveCollab(): void {
        this.socket.emit('leaveCollab', this.room);
    }

    /* collabData:
        collabDrawingId: string,
        strokes: Strokes[],
        strokesSelected: Strokes[]
    */
    updateCollabInfo(collabData: any): void {
        collabData.collabDrawingId = this.room;
        this.socket.emit('updateCollabInfo', collabData);
    }

    // EDITOR BROADCASTS
    // Un stroke: voir les classes Stroke, StrokePencil, StrokeRectangle et StrokeEllipse
    broadcastStroke(stroke: any): void {
        stroke.sender = this.socket.id;
        const data = {
            room: this.room,
            data: stroke
        }
        this.socket.emit('broadcastStroke', data);
    }

    /* selection:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastSelection(selection: any): void {
        selection.sender = this.socket.id;
        const data = {
            room: this.room,
            data: selection
        }
        this.socket.emit('broadcastSelection', data);
    }

    /* selectionPos:
    {
        sender: string,
        pos: Vec2,
    }*/
    broadcastSelectionPos(selectionPos: any): void {
        selectionPos.sender = this.socket.id;
        const data = {
            room: this.room,
            data: selectionPos
        }
        this.socket.emit('broadcastSelectionPos', data);
    }

    /* selectionSize:
    {
        sender: string,
        strokeIndex: number,
        newPos: Vec2,
        newDimensions: Vec2,
        scale: Vec2,
    }*/
    broadcastSelectionSize(selectionSize: any): void {
        selectionSize.sender = this.socket.id;
        const data = {
            room: this.room,
            data: selectionSize
        }
        this.socket.emit('broadcastSelectionSize', data);
    }

    /* pasteData:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastPasteRequest(pasteData: any): void {
        pasteData.sender = this.socket.id;
        const data = {
            room: this.room,
            data: pasteData
        }
        this.socket.emit('broadcastPasteRequest', data);
    }

    /* delData:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastDeleteRequest(delData: any): void {
        delData.sender = this.socket.id;
        const data = {
            room: this.room,
            data: delData
        }
        this.socket.emit('broadcastDeleteRequest', data);
    }

    /* width:
    {
      sender: string,
      strokeIndex: number,
      value: number,
    }*/
    broadcastNewStrokeWidth(width: any): void {
        width.sender = this.socket.id;
        const data = {
            room: this.room,
            data: width
        }
        this.socket.emit('broadcastNewStrokeWidth', data);
    }

    /* color:
    {
      sender: string,
      strokeIndex: number,
      color: string, (genre rgb(0, 0, 0))
    }*/
    broadcastNewPrimaryColor(color: any): void {
        color.sender = this.socket.id;
        const data = {
            room: this.room,
            data: color
        }
        this.socket.emit('broadcastNewPrimaryColor', data);
    }

     /* color:
    {
      sender: string,
      strokeIndex: number,
      color: string, (genre rgb(0, 0, 0))
    }*/
    broadcastNewSecondaryColor(color: any): void {
        color.sender = this.socket.id;
        const data = {
            room: this.room,
            data: color
        }
        this.socket.emit('broadcastNewSecondaryColor', data);
    }
}
