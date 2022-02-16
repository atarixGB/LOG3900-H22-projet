import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { ShapeService } from '@app/services/editor/tools/shape/shape.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeService {
    private shortestSide: number;
    width: number;
    height: number;

    constructor(protected drawingService: DrawingService, colorManager: ColorManagerService) {
        super(drawingService, colorManager);
    }

    drawShape(ctx: CanvasRenderingContext2D, isAnotherShapeBorder?: boolean): void {
        if (!this.isShiftShape) {
            this.drawRectangle(ctx, isAnotherShapeBorder);
        } else {
            this.drawSquare(ctx, isAnotherShapeBorder);
        }
    }

    onMouseUp(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (!this.isShiftShape) {
            this.drawRectangle(this.drawingService.baseCtx, false);
            this.width = this.pathData[this.pathData.length - 1].x - this.pathData[0].x;
            this.height = this.pathData[this.pathData.length - 1].y - this.pathData[0].y;
        } else {
            this.drawSquare(this.drawingService.baseCtx, false);
            this.isShiftShape = false;
            this.width = this.shortestSide;
            this.height = this.shortestSide;
        }

        this.mouseDown = false;

        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {

            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.previewCtx);
        }
    }

    lowerLeft(path: Vec2[]): void {
        this.origin = { x: path[0].x - this.shortestSide, y: path[0].y };
    }
    upperLeft(path: Vec2[]): void {
        this.origin = { x: path[0].x - this.shortestSide, y: path[0].y - this.shortestSide };
    }
    upperRight(path: Vec2[]): void {
        this.origin = { x: path[0].x, y: path[0].y - this.shortestSide };
    }
    lowerRight(path: Vec2[]): void {
        this.origin = { x: path[0].x, y: path[0].y };
    }

    drawRectangle(ctx: CanvasRenderingContext2D, isAnotherShapeBorder?: boolean): void {
        const width = this.pathData[this.pathData.length - 1].x - this.pathData[0].x;
        const length = this.pathData[this.pathData.length - 1].y - this.pathData[0].y;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.rect(this.pathData[0].x, this.pathData[0].y, width, length);

        if (isAnotherShapeBorder) {
            ctx.rect(this.pathData[0].x, this.pathData[0].y, width, length);
            ctx.stroke();
        } else {
            this.updateBorderType(ctx);
        }
    }

    drawSquare(ctx: CanvasRenderingContext2D, isAnotherShapeBorder?: boolean): void {
        this.computeSize();
        this.findMouseDirection();
        this.shortestSide = Math.abs(this.size.x) < Math.abs(this.size.y) ? Math.abs(this.size.x) : Math.abs(this.size.y);
        this.pathData.push({ x: this.origin.x + this.shortestSide, y: this.origin.y + this.shortestSide });
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.rect(this.origin.x, this.origin.y, this.shortestSide, this.shortestSide);

        if (isAnotherShapeBorder) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            ctx.rect(this.origin.x, this.origin.y, this.shortestSide, this.shortestSide);
            ctx.stroke();
        } else {
            this.updateBorderType(ctx);
        }
    }

    setPath(path: Vec2[]): void {
        this.pathData = path;
    }
}
