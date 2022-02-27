import { Injectable } from '@angular/core';
import { StrokePencil } from '@app/classes/stroke-pencil';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS, MouseButton } from '@app/constants/constants';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/editor/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    pencilThickness: number;
    color: string;
    private pathData: Vec2[];

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService, private collaborationService: CollaborationService) {
        super(drawingService);
        this.clearPath();
        this.pencilThickness = DEFAULT_LINE_THICKNESS;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;

            this.broadcastPencil(false);
        }

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.mouseMove) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawPoint(this.drawingService.baseCtx, this.pathData);
            this.broadcastPencil(true);
        }
        this.mouseMove = false;
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            ctx.lineWidth = this.pencilThickness;
        }
        const color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    private drawPoint(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, this.pencilThickness, 0, 2 * Math.PI, true);
        const color = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
        ctx.fillStyle = color;
        ctx.fill();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private broadcastPencil(isPoint: boolean): void {
        const pencilStroke = new StrokePencil(this.color, this.pencilThickness, this.pathData, isPoint);
        this.collaborationService.broadcastStroke(pencilStroke);
    }
}
