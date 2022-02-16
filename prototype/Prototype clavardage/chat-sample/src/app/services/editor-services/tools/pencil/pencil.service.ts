import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS, MouseButton } from '@app/constants/constants';
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

    constructor(drawingService: DrawingService, private colorManager: ColorManagerService) {
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
}
