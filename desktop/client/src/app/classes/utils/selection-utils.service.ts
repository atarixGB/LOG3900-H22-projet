import { Injectable } from '@angular/core';
import { SelectionTool } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { CONTROLPOINTSIZE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

const SELECTION_DEFAULT_LINE_THICKNESS = 3;

@Injectable({
    providedIn: 'root',
})
export class SelectionUtilsService {
    controlPointsCoord: Vec2[];
    cleanedUnderneath: boolean;
    isResizing: boolean;

    private origin: Vec2;
    private destination: Vec2;
    private width: number;
    private height: number;
    private resizedSelection: SelectionTool;
    private previousLineWidthRectangle: number;
    private previousLineWidthEllipse: number;

    constructor(
        private drawingService: DrawingService,
        private rectangleService: RectangleService,
        private ellipseService: EllipseService,
    ) {
        this.cleanedUnderneath = false;
        this.isResizing = false;
    }

    initializeToolParameters(): void {
        this.previousLineWidthRectangle = this.rectangleService.lineWidth;
        this.previousLineWidthEllipse = this.ellipseService.lineWidth;
        this.rectangleService.isSelection = true;
        this.ellipseService.isSelection = true;
        this.rectangleService.lineWidth = SELECTION_DEFAULT_LINE_THICKNESS;
        this.ellipseService.lineWidth = SELECTION_DEFAULT_LINE_THICKNESS;

        this.drawingService.previewCtx.setLineDash([2]);
    }

    resetParametersTools(): void {
        this.rectangleService.mouseDown = false;
        this.rectangleService.lineWidth = this.previousLineWidthRectangle;
        this.ellipseService.mouseDown = false;
        this.ellipseService.lineWidth = this.previousLineWidthEllipse;
        this.drawingService.previewCtx.setLineDash([0]);
        this.rectangleService.isSelection = false;
        this.ellipseService.isSelection = false;
    }

    mouseInSelectionArea(origin: Vec2, destination: Vec2, mouseCoord: Vec2): boolean {
        return mouseCoord.x >= origin.x && mouseCoord.x <= destination.x && mouseCoord.y >= origin.y && mouseCoord.y <= destination.y;
    }

    reajustOriginAndDestination(selection: SelectionTool): SelectionTool {
        if (selection.width <= 0 && selection.height <= 0) {
            const temp = selection.origin;
            selection.origin = selection.destination;
            selection.destination = temp;
        } else if (selection.width <= 0) {
            selection.origin.x += selection.width;
            selection.destination.x += Math.abs(selection.width);
        } else if (selection.height <= 0) {
            selection.origin.y += selection.height;
            selection.destination.y += Math.abs(selection.height);
        }

        selection.width = Math.abs(selection.width);
        selection.height = Math.abs(selection.height);

        return selection;
    }

    createBoundaryBox(selection: SelectionTool): void {
        this.initializeToolParameters();
        if (selection.isEllipse) {
            this.ellipseService.clearPath();
            this.ellipseService.pathData.push(selection.origin);
            this.ellipseService.pathData.push(selection.destination);
            this.ellipseService.drawShape(this.drawingService.previewCtx);
        } else {
            this.rectangleService.clearPath();
            this.rectangleService.pathData.push(selection.origin);
            this.rectangleService.pathData.push(selection.destination);
            this.rectangleService.drawShape(this.drawingService.previewCtx);
        }

        this.createControlPoints(selection);
    }

    createControlPoints(selection: SelectionTool): void {
        const ctx = this.drawingService.previewCtx;
        const alignmentFactor = -CONTROLPOINTSIZE / 2;
        this.controlPointsCoord = [
            { x: selection.origin.x, y: selection.origin.y },
            { x: selection.destination.x, y: selection.origin.y },
            { x: selection.destination.x, y: selection.destination.y },
            { x: selection.origin.x, y: selection.destination.y },
            { x: selection.origin.x + selection.width / 2, y: selection.origin.y },
            { x: selection.destination.x, y: selection.origin.y + selection.height / 2 },
            { x: selection.origin.x + selection.width / 2, y: selection.destination.y },
            { x: selection.origin.x, y: selection.origin.y + selection.height / 2 },
        ];

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#FFFFFF';

        for (const box of this.controlPointsCoord) {
            box.x += alignmentFactor;
            box.y += alignmentFactor;
            ctx.rect(box.x, box.y, CONTROLPOINTSIZE, CONTROLPOINTSIZE);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    clearUnderneathShape(selection: SelectionTool): void {
        this.drawingService.baseCtx.fillStyle = '#FFFFFF';
        this.drawingService.baseCtx.beginPath();
        if (selection.isEllipse) {
            this.drawingService.baseCtx.ellipse(
                selection.origin.x + selection.width / 2,
                selection.origin.y + selection.height / 2,
                selection.width / 2,
                selection.height / 2,
                0,
                2 * Math.PI,
                0,
            );
            this.drawingService.baseCtx.fill();
            this.drawingService.baseCtx.closePath();
        } else {
            this.drawingService.baseCtx.fillRect(selection.origin.x, selection.origin.y, selection.width, selection.height);
            this.drawingService.baseCtx.closePath();
        }
    }

    resizeSelection(ctx: CanvasRenderingContext2D, mouseCoord: Vec2, selection: SelectionTool): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (!this.cleanedUnderneath) {
            this.clearUnderneathShape(selection);
            this.cleanedUnderneath = true;
        }

        this.origin = selection.origin;
        this.destination = { x: this.origin.x + this.width, y: this.origin.y + this.height };
        this.resizedSelection = new SelectionTool(this.origin, this.destination, this.width, this.height);
        this.createBoundaryBox(this.resizedSelection);
    }

    endResizeSelection(): SelectionTool {
        this.isResizing = false;
        this.cleanedUnderneath = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.destination = { x: this.origin.x + this.width, y: this.origin.y + this.height };
        this.resizedSelection = this.reajustOriginAndDestination(new SelectionTool(this.origin, this.destination, this.width, this.height));
        return this.resizedSelection;
    }
}
