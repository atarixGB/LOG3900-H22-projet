import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { StrokeEllipse } from '@app/classes/strokes/stroke-ellipse';
import { StrokePencil } from '@app/classes/strokes/stroke-pencil';
import { StrokeRectangle } from '@app/classes/strokes/stroke-rectangle';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';
import { SelectionService } from '../editor/tools/selection/selection.service';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;

    constructor(public drawingService: DrawingService, private selectionService: SelectionService) { }

    enterCollaboration(): void {
        this.socket = io.io('http://localhost:3002/', { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: any) => {
            if (stroke.sender !== this.socket.id) {
                switch (stroke.toolType) {
                    case 'rectangle': {
                        const strokeRect: Stroke = new StrokeRectangle(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.secondaryColor, stroke.topLeftCorner, stroke.width, stroke.height, stroke.shapeType);
                        strokeRect.drawStroke(this.drawingService.baseCtx);
                        this.selectionService.addStroke(strokeRect);
                        break;
                    }
                    case 'ellipse': {
                        const strokeEllipse: Stroke = new StrokeEllipse(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.secondaryColor, stroke.center, stroke.radius, stroke.shapeType);
                        strokeEllipse.drawStroke(this.drawingService.baseCtx);
                        this.selectionService.addStroke(strokeEllipse);
                        break;
                    }
                    case 'pencil': {
                        const strokePencil: Stroke = new StrokePencil(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.points, stroke.isPoint);
                        strokePencil.drawStroke(this.drawingService.baseCtx);
                        this.selectionService.addStroke(strokePencil);
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
