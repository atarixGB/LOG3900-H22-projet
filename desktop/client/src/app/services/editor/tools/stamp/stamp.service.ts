import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MOST_LIKED } from '@app/constants/badges';
import { CNV_HEIGTH, MouseButton } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { Observable, Subject } from 'rxjs';

const SCALE_FACTOR_STAMP = 1;
const ROTATION_STEP_STAMP = 15;
const MAX_ANGLE = 360;
const SIZE_STAMP = CNV_HEIGTH / 10;
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    isEnabled: boolean;

    imageCoords: Vec2;
    img: HTMLImageElement;
    size: number;
    resizeFactor: number;
    color: string;
    angle: number;
    mouseEvent: MouseEvent;

    clearSelectionStrokes: Subject<any>;
    clearSelectionStrokes$: Observable<any>;

    private angleObservable: Subject<number> = new Subject<number>();

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.img = new Image(SIZE_STAMP, SIZE_STAMP);
        this.img.src = MOST_LIKED;

        this.size = SIZE_STAMP;
        this.angle = 0;
        this.resizeFactor = SCALE_FACTOR_STAMP;
        this.isEnabled = false;

        this.clearSelectionStrokes = new Subject();
        this.clearSelectionStrokes$ = this.clearSelectionStrokes.asObservable();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.imageCoords = this.getPositionFromMouse(event);
            this.drawStamp(this.getPositionFromMouse(event));
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.imageCoords = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewCursor(this.getPositionFromMouse(event));
    }

    onWheelEvent(event: WheelEvent): void {
        let rotationStep = ROTATION_STEP_STAMP;
        this.changeAngle(this.angle - (event.deltaY / Math.abs(event.deltaY)) * rotationStep);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewCursor(this.getPositionFromMouse(event));
    }

    private changeAngle(newAngle: number): void {
        newAngle %= MAX_ANGLE;

        if (newAngle < 0) {
            newAngle += MAX_ANGLE;
        }

        this.angle = newAngle;
        this.angleObservable.next(this.angle);
    }
    
    private drawStamp(event: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const realStampWidth = this.size * this.resizeFactor;
        const realStampHeight = this.size * this.resizeFactor;
        let ctx = this.drawingService.baseCtx;
        ctx.save();
        ctx.translate(this.imageCoords.x + realStampWidth / 2, this.imageCoords.y + realStampHeight / 2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.imageCoords.x - realStampWidth / 2, -this.imageCoords.y - realStampHeight / 2);
        ctx.drawImage(
            this.img,
            this.imageCoords.x -
                (realStampWidth / 2) *
                    (Math.cos(this.angle * Math.PI / 180) + Math.sin(this.angle * Math.PI / 180)),
            this.imageCoords.y -
                (realStampHeight / 2) *
                    (Math.cos(this.angle * Math.PI / 180) - Math.sin(this.angle * Math.PI / 180)),
            realStampWidth,
            realStampHeight,
        );
        ctx.restore();

        this.drawingService.setCurrentDrawingToBaseData();
        this.clearSelectionStrokes.next();
    }

    private previewCursor(event: Vec2): void {
        const realStampWidth = this.size * this.resizeFactor;
        const realStampHeight = this.size * this.resizeFactor;
        let ctx = this.drawingService.previewCtx;
        ctx.save();
        ctx.translate(this.imageCoords.x + realStampWidth / 2, this.imageCoords.y + realStampHeight / 2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.imageCoords.x - realStampWidth / 2, -this.imageCoords.y - realStampHeight / 2);
        ctx.drawImage(
            this.img,
            this.imageCoords.x -
                (realStampWidth / 2) *
                    (Math.cos(this.angle * Math.PI / 180) + Math.sin(this.angle * Math.PI / 180)),
            this.imageCoords.y -
                (realStampHeight / 2) *
                    (Math.cos(this.angle * Math.PI / 180) - Math.sin(this.angle * Math.PI / 180)),
            realStampWidth,
            realStampHeight,
        );
        ctx.restore();
    }
}