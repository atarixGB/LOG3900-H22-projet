import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { DATABASE_URL } from '@app/constants/api-urls';

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
    }

    enterCollaboration(): void {
        this.socket = io.io(DATABASE_URL, { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: any) => {
            if (stroke.sender !== this.socket.id) {
                this.newStroke.next(stroke);
            }
        });

        this.socket.on('receiveSelection', (selection: any) => {
            if (selection.sender !== this.socket.id) {
                this.newSelection.next(selection);
            }
        });

        this.socket.on('receiveSelectionPos', (selectionPos: any) => {
            if (selectionPos.sender !== this.socket.id) {
                this.newSelectionPos.next(selectionPos);
            }
        });

        this.socket.on('receiveSelectionSize', (selectionSize: any) => {
            if (selectionSize.sender !== this.socket.id) {
                this.newSelectionSize.next(selectionSize); 
            }
        });

        this.socket.on('receivePasteRequest', (pasteReq: any) => {
            if (pasteReq.sender !== this.socket.id) {
                this.pasteRequest.next(pasteReq); 
            }
        });

        this.socket.on('receiveDeleteRequest', (delReq: any) => {
            if (delReq.sender !== this.socket.id) {
                this.deleteRequest.next(delReq); 
            }
        });

        this.socket.on('receiveStrokeWidth', (width: any) => {
            if (width.sender !== this.socket.id) {
                this.newStrokeWidth.next(width); 
            }
        });

        this.socket.on('receiveNewPrimaryColor', (color: any) => {
            if (color.sender !== this.socket.id) {
                this.newPrimaryColor.next(color); 
            }
        });

        this.socket.on('receiveNewSecondaryColor', (color: any) => {
            if (color.sender !== this.socket.id) {
                this.newSecondaryColor.next(color); 
            }
        });
    } 

    // Un stroke: voir les classes Stroke, StrokePencil, StrokeRectangle et StrokeEllipse
    broadcastStroke(stroke: any): void {
        stroke.sender = this.socket.id;
        this.socket.emit('broadcastStroke', stroke);
    }

    /* selection:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastSelection(selection: any): void {
        selection.sender = this.socket.id;
        this.socket.emit('broadcastSelection', selection);
    }

    /* selectionPos:
    {
        sender: string,
        pos: Vec2,
    }*/
    broadcastSelectionPos(selectionPos: any): void {
        selectionPos.sender = this.socket.id;
        this.socket.emit('broadcastSelectionPos', selectionPos);
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
        this.socket.emit('broadcastSelectionSize', selectionSize);
    }

    /* pasteData:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastPasteRequest(pasteData: any): void {
        pasteData.sender = this.socket.id;
        this.socket.emit('broadcastPasteRequest', pasteData);
    }

    /* delData:
    {
      sender: string,
      strokeIndex: number,
    }*/
    broadcastDeleteRequest(delData: any): void {
        delData.sender = this.socket.id;
        this.socket.emit('broadcastDeleteRequest', delData);
    }

    /* width:
    {
      sender: string,
      strokeIndex: number,
      value: number,
    }*/
    broadcastNewStrokeWidth(width: any): void {
        width.sender = this.socket.id;
        this.socket.emit('broadcastNewStrokeWidth', width);
    }

    /* color:
    {
      sender: string,
      strokeIndex: number,
      color: string, (genre rgb(0, 0, 0))
    }*/
    broadcastNewPrimaryColor(color: any): void {
        color.sender = this.socket.id;
        this.socket.emit('broadcastNewPrimaryColor', color);
    }

     /* color:
    {
      sender: string,
      strokeIndex: number,
      color: string, (genre rgb(0, 0, 0))
    }*/
    broadcastNewSecondaryColor(color: any): void {
        color.sender = this.socket.id;
        this.socket.emit('broadcastNewSecondaryColor', color);
    }
}
