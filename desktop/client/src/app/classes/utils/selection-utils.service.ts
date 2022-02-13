import { Injectable } from '@angular/core';
import { SelectionTool } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { CONTROLPOINTSIZE } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';

const SELECTION_DEFAULT_LINE_THICKNESS = 3;

@Injectable({
    providedIn: 'root',
})
export class SelectionUtilsService {
    controlPointsCoord: Vec2[];
    cleanedUnderneath: boolean;

    private previousLineWidthRectangle: number;

    constructor(
        private drawingService: DrawingService,
        private rectangleService: RectangleService,
    ) {
        this.cleanedUnderneath = false;
    }

    initializeToolParameters(): void {
        this.previousLineWidthRectangle = this.rectangleService.lineWidth;
        this.rectangleService.isSelection = true;
        this.rectangleService.lineWidth = SELECTION_DEFAULT_LINE_THICKNESS;
        this.drawingService.previewCtx.setLineDash([2]);
    }

    resetParametersTools(): void {
        this.rectangleService.mouseDown = false;
        this.rectangleService.lineWidth = this.previousLineWidthRectangle;
        this.drawingService.previewCtx.setLineDash([0]);
        this.rectangleService.isSelection = false;
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
        this.rectangleService.clearPath();
        this.rectangleService.pathData.push(selection.origin);
        this.rectangleService.pathData.push(selection.destination);
        this.rectangleService.drawShape(this.drawingService.previewCtx);
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
}
