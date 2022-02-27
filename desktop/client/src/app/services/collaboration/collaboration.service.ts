import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/stroke';
import { StrokeRectangle } from '@app/classes/stroke-rectangle';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class CollaborationService {
    socket: any;

    constructor(public drawingService: DrawingService) { }

    enterCollaboration(): void {
        this.socket = io.io('http://localhost:3002/', { transports: ['websocket'] });

        this.socket.on('receiveStroke', (stroke: Stroke) => {
            if (stroke.sender !== this.socket.id) {
                console.log('Stroke received');
                if (stroke.toolType === 'rectangle') {
                    this.drawRectangle(stroke as StrokeRectangle, this.drawingService.baseCtx);
                }
            }
        });
    }

    broadcastStroke(stroke: Stroke): void {
        stroke.sender = this.socket.id;
        this.socket.emit('broadcastStroke', stroke);
    }

    private drawRectangle(stroke: StrokeRectangle, ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = stroke.strokeWidth;
        ctx.beginPath();
        ctx.rect(stroke.topLeftCorner.x, stroke.topLeftCorner.y, stroke.width, stroke.height);
        if (stroke.shapeType === TypeStyle.Stroke) {
            ctx.strokeStyle = stroke.secondaryColor;
            ctx.fillStyle = 'rgba(255, 0, 0, 0)';
        } else if (stroke.shapeType === TypeStyle.Fill) {
            ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
            ctx.fillStyle = stroke.primaryColor;
        } else {
            ctx.strokeStyle = stroke.secondaryColor;
            ctx.fillStyle = stroke.primaryColor;
        }
        ctx.fill();
        ctx.stroke();
    }
}
