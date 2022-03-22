import { Injectable } from '@angular/core';
import { StrokePencil } from '@app/classes/strokes/stroke-pencil';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS, MouseButton } from '@app/constants/constants';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';
import { ColorManagerService } from 'src/app/services/editor/color-manager/color-manager.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    pencilThickness: number;
    color: string;
    leftestCoord: number;
    rightestCoord: number;
    lowestCoord: number;
    highestCoord: number;
    selectedWidth: number;

    private pathData: Vec2[];

    constructor(
        drawingService: DrawingService,
        private colorManager: ColorManagerService,
        private collaborationService: CollaborationService,
        private selectionService: SelectionService,
        private soundEffectsService: SoundEffectsService,
    ) {
        super(drawingService);
        this.clearPath();
        this.pencilThickness = DEFAULT_LINE_THICKNESS;
        this.selectedWidth = 1;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const cnvPos = { x: this.drawingService.canvas.getBoundingClientRect().left, y: this.drawingService.canvas.getBoundingClientRect().top};
        const mousePos = { x: event.clientX, y: event.clientY };
        return { x: mousePos.x - cnvPos.x, y: mousePos.y - cnvPos.y };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.setInitialBounds();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);

            this.soundEffectsService.startDrawSound();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown && this.pathData.length > 1) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.color = this.colorManager.primaryColor;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.sendPencilStroke();
        }
        this.soundEffectsService.stopDrawSound();
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseMove = true;
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.checkEdgeCoords(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            ctx.lineWidth = this.pencilThickness;
        }
        ctx.strokeStyle = this.colorManager.primaryColor;
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private setInitialBounds(): void {
        this.leftestCoord = this.drawingService.canvas.width;
        this.rightestCoord = 0;
        this.lowestCoord = 0;
        this.highestCoord = this.drawingService.canvas.height;
    }

    private checkEdgeCoords(currentPos: Vec2): void {
        if (currentPos.x < this.leftestCoord) {
            this.leftestCoord = currentPos.x;
        }
        if (currentPos.x > this.rightestCoord) {
            this.rightestCoord = currentPos.x;
        }
        if (currentPos.y > this.lowestCoord) {
            this.lowestCoord = currentPos.y;
        }
        if (currentPos.y < this.highestCoord) {
            this.highestCoord = currentPos.y;
        }
    }

    private sendPencilStroke(): void {
        const pencilStroke = new StrokePencil(this.getBoundingPoints(), this.color, this.pencilThickness, this.pathData);
        this.collaborationService.broadcastStroke(pencilStroke);
        this.selectionService.addStroke(pencilStroke);
        this.selectionService.selectStroke(pencilStroke);
        this.selectionService.switchToSelectionTool(ToolList.Pencil);
    }

    private getBoundingPoints(): Vec2[] {
        const topLeftPoint = { x: this.leftestCoord, y: this.highestCoord };
        const bottomRightPoint = { x: this.rightestCoord, y: this.lowestCoord };
        return [topLeftPoint, bottomRightPoint];
    }
}
