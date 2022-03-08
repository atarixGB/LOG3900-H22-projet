import { Injectable } from '@angular/core';
import * as strokeDrawer from '@app/classes/strokes/stroke-drawer';
import { StrokeEllipse } from '@app/classes/strokes/stroke-ellipse';
import { StrokePencil } from '@app/classes/strokes/stroke-pencil';
import { StrokeRectangle } from '@app/classes/strokes/stroke-rectangle';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';
import { COLLAB_URL } from '@app/constants/api-urls';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;

    constructor(public drawingService: DrawingService) { }

    enterCollaboration(): void {
        this.socket = io.io(COLLAB_URL, { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: any) => {
            if (stroke.sender !== this.socket.id) {
                switch (stroke.toolType) {
                    case 'rectangle': {
                        strokeDrawer.drawStrokeRectangle(stroke as StrokeRectangle, this.drawingService.baseCtx);
                        break; 
                    }
                    case 'ellipse': {
                        strokeDrawer.drawStrokeEllipse(stroke as StrokeEllipse, this.drawingService.baseCtx);
                        break;
                    }
                    case 'pencil': {
                        strokeDrawer.drawStrokePencil(stroke as StrokePencil, this.drawingService.baseCtx);
                        break;
                    }
                }
            }
        });
    }

    broadcastStroke(stroke: any): void {
        stroke.sender = this.socket.id;
        this.socket.emit('broadcastStroke', stroke);
    }
}
