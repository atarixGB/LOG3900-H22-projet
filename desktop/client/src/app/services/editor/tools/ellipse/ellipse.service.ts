import { Injectable } from '@angular/core';
import { StrokeEllipse } from '@app/classes/strokes/stroke-ellipse';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/constants';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { RectangleService } from '@app/services/editor/tools/rectangle/rectangle.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { ShapeService } from '@app/services/editor/tools/shape/shape.service';
@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeService {
    private radius: number;
    width: number;
    height: number;
    constructor(
        protected drawingService: DrawingService,
        private rectangle: RectangleService,
        colorManager: ColorManagerService,
        private collaborationService: CollaborationService,
        private selectionService: SelectionService,
    ) {
        super(drawingService, colorManager);
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const cnvPos = { x: this.drawingService.canvas.getBoundingClientRect().left, y: this.drawingService.canvas.getBoundingClientRect().top};
        const mousePos = { x: event.clientX, y: event.clientY };
        return { x: mousePos.x - cnvPos.x, y: mousePos.y - cnvPos.y };
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.ellipse(this.origin.x, this.origin.y, this.size.x / 2, this.size.y / 2, 0, 2 * Math.PI, 0);
        ctx.fillStyle = this.colorSecond;
        ctx.strokeStyle = this.colorPrime;
        ctx.fill();
        ctx.stroke();
    }

    private drawCircle(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.lineWidth;
        this.radius = Math.abs(this.size.x) < Math.abs(this.size.y) ? Math.abs(this.size.x) / 2 : Math.abs(this.size.y) / 2;
        this.pathData.push({ x: this.origin.x + this.radius, y: this.origin.y + this.radius });
        ctx.beginPath();
        ctx.ellipse(this.origin.x, this.origin.y, this.radius, this.radius, 0, 2 * Math.PI, 0);
    }

    drawShape(ctx: CanvasRenderingContext2D): void {
        this.rectangle.setPath(this.pathData);
        this.computeSize();
        this.findMouseDirection();
        if (!this.isShiftShape) {
            this.rectangle.drawRectangle(ctx, true);
            this.drawEllipse(ctx);
        } else {
            this.rectangle.drawSquare(ctx, true);
            this.drawCircle(ctx);
        }
    }

    onMouseDown(event: MouseEvent): void {
        super.onMouseDown(event);
        if (event.button === MouseButton.Left) {
            this.size = { x: 0, y: 0};
            this.origin = this.getPositionFromMouse(event);
        }
    }

    onMouseUp(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (!this.isShiftShape) {
            this.drawEllipse(this.drawingService.baseCtx);
            this.width = this.size.x / 2;
            this.height = this.size.y / 2;

            this.sendEllipseStroke();
        } else {
            this.drawCircle(this.drawingService.baseCtx);
            this.width = this.radius;
            this.height = this.radius;
            this.isShiftShape = false;
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

    lowerLeft(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x - this.radius, y: this.pathData[0].y + this.radius };
        } else {
            this.origin = { x: this.pathData[0].x - this.size.x / 2, y: this.pathData[0].y + this.size.y / 2 };
        }
    }

    upperRight(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x + this.radius, y: this.pathData[0].y - this.radius };
        } else {
            this.origin = { x: this.pathData[0].x + this.size.x / 2, y: this.pathData[0].y - this.size.y / 2 };
        }
    }

    upperLeft(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x - this.radius, y: this.pathData[0].y - this.radius };
        } else {
            this.origin = { x: this.pathData[0].x - this.size.x / 2, y: this.pathData[0].y - this.size.y / 2 };
        }
    }

    lowerRight(): void {
        if (this.isShiftShape) {
            this.origin = { x: this.pathData[0].x + this.radius, y: this.pathData[0].y + this.radius };
        } else {
            this.origin = { x: this.pathData[0].x + this.size.x / 2, y: this.pathData[0].y + this.size.y / 2 };
        }
    }

    private sendEllipseStroke(): void {
        const ellipseStroke = new StrokeEllipse(
            this.getBoundingPoints(),
            this.colorPrime,
            this.lineWidth,
            this.colorSecond,
            this.origin,
            { x: this.size.x / 2, y: this.size.y / 2 },
            this.selectType,
        );
        this.collaborationService.broadcastStroke(ellipseStroke);
        this.selectionService.addStroke(ellipseStroke);
        this.selectionService.selectStroke(ellipseStroke);
        this.selectionService.switchToSelectionTool(ToolList.Ellipse);
    }

    private getBoundingPoints(): Vec2[] {
        const topLeft = { x: this.origin.x - this.size.x / 2, y: this.origin.y - this.size.y / 2 };
        const bottomRight = { x: this.origin.x + this.size.x / 2, y: this.origin.y + this.size.y / 2 };
        return [topLeft, bottomRight];
    }
}
