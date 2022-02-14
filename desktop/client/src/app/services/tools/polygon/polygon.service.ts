import { Injectable } from '@angular/core';
import { ToolShape } from '@app/classes/tool-shape';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS } from '@app/constants/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { ColorManagerService } from '@app/services/color-manager/color-manager.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

const DASH_SEGMENT_FIRST = 1;
const DASH_SEGMENT_SECONDARY = 3;
export const DOUBLE_MATH = 2;
const MIN_SIDE = 3;
@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ToolShape {
    private pointCircleCenter: Vec2;
    radius: number;
    sides: number;
    fillValue: boolean;
    strokeValue: boolean;
    lineWidth: number;

    constructor(protected drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        this.sides = MIN_SIDE;
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.fillValue = false;
        this.strokeValue = false;
        this.selectType = TypeStyle.Stroke;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.finalPoint = this.getPositionFromMouse(event);
            this.drawPolygon(this.drawingService.baseCtx);
            this.mouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.finalPoint = this.getPositionFromMouse(event);
            this.ctxPreviewPerimeter();
            this.drawPolygon(this.drawingService.previewCtx);
        }
    }

    protected ctxPreviewPerimeter(): void {
        const shiftLastPoint = this.squarePoint(this.firstPoint, this.finalPoint);
        this.pointCircleCenter = this.getCircleCenter(this.firstPoint, shiftLastPoint);
        this.radius = Math.abs(this.finalPoint.x - this.firstPoint.x) / DOUBLE_MATH;
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.lineWidth = DEFAULT_LINE_THICKNESS;
        this.drawingService.previewCtx.setLineDash([DASH_SEGMENT_FIRST, DASH_SEGMENT_SECONDARY]);
        this.drawingService.previewCtx.ellipse(
            this.pointCircleCenter.x,
            this.pointCircleCenter.y,
            this.radius,
            this.radius,
            0,
            0,
            Math.PI * DOUBLE_MATH,
        );
        this.drawingService.previewCtx.stroke();
        this.drawingService.previewCtx.setLineDash([]);
        this.drawingService.previewCtx.closePath();
    }

    drawPolygon(ctx: CanvasRenderingContext2D): void {
        const radiusFinal = this.initializePolygonVariables();
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.colorManager.selectedColor[ColorOrder.SecondaryColor].inString;
        ctx.fillStyle = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;

        ctx.moveTo(
            this.pointCircleCenter.x + radiusFinal * Math.cos(-Math.PI / DOUBLE_MATH),
            this.pointCircleCenter.y + radiusFinal * Math.sin(-Math.PI / DOUBLE_MATH),
        );
        for (let j = 1; j <= this.sides + 1; j++) {
            ctx.lineTo(
                this.pointCircleCenter.x + radiusFinal * Math.cos((j * DOUBLE_MATH * Math.PI) / this.sides - Math.PI / DOUBLE_MATH),
                this.pointCircleCenter.y + radiusFinal * Math.sin((j * DOUBLE_MATH * Math.PI) / this.sides - Math.PI / DOUBLE_MATH),
            );
        }
        this.changeSelectedType();
        if (this.fillValue && this.strokeValue) {
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        } else {
            if (this.fillValue) {
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    protected initializePolygonVariables(): number {
        const squarePoint = this.squarePoint(this.firstPoint, this.finalPoint);
        this.pointCircleCenter = this.getCircleCenter(this.firstPoint, squarePoint);
        this.radius = Math.abs(this.finalPoint.x - this.firstPoint.x) / DOUBLE_MATH;
        const radiusFinal = Math.abs(this.radius - this.lineWidth / DOUBLE_MATH - this.lineWidth / this.sides);

        return radiusFinal;
    }

    changeSelectedType(): void {
        switch (this.selectType) {
            case TypeStyle.Stroke:
                this.fillValue = false;
                this.strokeValue = true;
                break;
            case TypeStyle.Fill:
                this.fillValue = true;
                this.strokeValue = false;
                break;
            case TypeStyle.StrokeFill:
                this.fillValue = true;
                this.strokeValue = true;
                break;
        }
    }
}
