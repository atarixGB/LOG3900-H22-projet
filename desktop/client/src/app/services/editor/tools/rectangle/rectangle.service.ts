import { Injectable } from '@angular/core';
import { StrokeRectangle } from '@app/classes/strokes/stroke-rectangle';
import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { ShapeService } from '@app/services/editor/tools/shape/shape.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeService {
    private shortestSide: number;
    width: number;
    height: number;

    constructor(
        protected drawingService: DrawingService,
        colorManager: ColorManagerService,
        private collaborationService: CollaborationService,
        private selectionService: SelectionService,
        protected soundEffectsService: SoundEffectsService,
    ) {
        super(drawingService, colorManager, soundEffectsService);
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const cnvPos = { x: this.drawingService.canvas.getBoundingClientRect().left, y: this.drawingService.canvas.getBoundingClientRect().top};
        const mousePos = { x: event.clientX, y: event.clientY };
        return { x: mousePos.x - cnvPos.x, y: mousePos.y - cnvPos.y };
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

            this.sendRectangleStroke();
        } else {
            this.drawSquare(this.drawingService.baseCtx, false);
            this.isShiftShape = false;
            this.width = this.shortestSide;
            this.height = this.shortestSide;
        }

        if (this.mouseDown) {
            this.mouseDown = false;
            this.soundEffectsService.stopDrawSound();
        }

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
            ctx.fillStyle = this.isClearSecondary ? 'rgba(0, 0, 0, 0)' : this.colorSecond;
            ctx.strokeStyle = this.colorPrime;
            ctx.fill();
            ctx.stroke();
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
        }
    }

    setPath(path: Vec2[]): void {
        this.pathData = path;
    }

    private sendRectangleStroke(): void {
        const rectStroke = new StrokeRectangle(
            this.getBoundingPoints(),
            this.colorPrime,
            this.lineWidth,
            this.colorSecond,
            this.findLeftPoint(this.pathData[0], this.pathData[this.pathData.length - 1]),
            Math.abs(this.width),
            Math.abs(this.height),
            this.isClearSecondary,
        );
        this.collaborationService.broadcastStroke(rectStroke);
        this.selectionService.addStroke(rectStroke);
        this.selectionService.selectStroke(rectStroke);
        this.selectionService.switchToSelectionTool(ToolList.Rectangle);
    }

    private getBoundingPoints(): Vec2[] {
        const topLeftPoint = this.findLeftPoint(this.pathData[0], this.pathData[this.pathData.length - 1]);
        const bottomRightPoint = { x: topLeftPoint.x + Math.abs(this.width), y: topLeftPoint.y + Math.abs(this.height) };
        return [topLeftPoint, bottomRightPoint];
    }
}
