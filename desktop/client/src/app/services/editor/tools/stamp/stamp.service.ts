import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MOST_LIKED } from '@app/constants/badges';
import { MouseButton } from '@app/constants/constants';
import { StampList } from '@app/interfaces-enums/stamp-list';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { Subject } from 'rxjs';

const SCALE_FACTOR_STAMP = 1;
const ROTATION_STEP_STAMP = 15;
const MAX_ANGLE = 360;
const SIZE_STAMP = 24;
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    isEnabled: boolean;

    imageCoords: Vec2;
    currentStamp: string;
    selectStamp: StampList;
    img: HTMLImageElement;
    size: number;
    resizeFactor: number;
    color: string;
    angle: number;
    isKeyAltDown: boolean;
    mouseEvent: MouseEvent;

    stampBindings: Map<StampList, string>;
    srcBinding: Map<string, string>;

    private angleObservable: Subject<number> = new Subject<number>();

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.img = new Image(this.size, this.size);
        this.img.src = MOST_LIKED;

        this.size = SIZE_STAMP;
        this.angle = 0;
        this.resizeFactor = SCALE_FACTOR_STAMP;
        this.isEnabled = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.imageCoords = this.getPositionFromMouse(event);
            this.drawStamp(this.getPositionFromMouse(event));
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseEvent = event;
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

    changeStamp(): void {
        if (this.stampBindings.has(this.selectStamp)) {
            this.currentStamp = this.stampBindings.get(this.selectStamp)!;
        }
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