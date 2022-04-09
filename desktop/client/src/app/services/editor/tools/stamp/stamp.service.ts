import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MOST_LIKED } from '@app/constants/badges';
import { MouseButton } from '@app/constants/constants';
import { DEAD, GLASSES, HAPPY, SAD, SURPRISED } from '@app/constants/stamp-data';
import { StampList } from '@app/interfaces-enums/stamp-list';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { Subject } from 'rxjs';

const SCALE_FACTOR_STAMP = 1;
const ROTATION_STEP_STAMP = 15;
const MAX_ANGLE = 360;
// const ANGLE_HALF_TURN = 180;
const SIZE_STAMP = 24;
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    imageCoords: Vec2;
    currentStamp: string;
    selectStamp: StampList;
    imageSrc: string;
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

        this.stampBindings = new Map<StampList, string>();
        this.stampBindings
            .set(StampList.Surprised, 'surprised')
            .set(StampList.Happy, 'happy')
            .set(StampList.Sad, 'sad')
            .set(StampList.Glasses, 'glasses')
            .set(StampList.Dead, 'dead');

        this.srcBinding = new Map<string, string>();
        this.srcBinding.set('surprised', SURPRISED).set('happy', HAPPY).set('sad', SAD).set('glasses', GLASSES).set('dead', DEAD);

        this.currentStamp = 'happy';
        this.selectStamp = StampList.Happy;
        this.size = SIZE_STAMP;
        this.angle = 0;
        this.isKeyAltDown = false;
        this.resizeFactor = SCALE_FACTOR_STAMP;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.imageCoords = this.getPositionFromMouse(event);
            this.drawStamp(this.getPositionFromMouse(event));
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Alt') {
            event.preventDefault();
            this.isKeyAltDown = true;
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Alt') {
            this.isKeyAltDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseEvent = event;
        this.previewCursor(this.getPositionFromMouse(event));
    }

    onWheelEvent(event: WheelEvent): void {
        let rotationStep = ROTATION_STEP_STAMP;
        if (this.isKeyAltDown) {
            rotationStep = 1;
        }
        this.changeAngle(this.angle - (event.deltaY / Math.abs(event.deltaY)) * rotationStep);
        this.onMouseMove(this.mouseEvent);
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
        /*if (this.srcBinding.has(this.currentStamp)) {
            this.imageSrc = this.srcBinding.get(this.currentStamp)!;
        }

        this.size = 24 * this.resizeFactor;

        let img = new Image(this.size, this.size);
        img.src = MOST_LIKED;

        const center: Vec2 = { x: event.x, y: event.y };

        this.drawingService.baseCtx.lineWidth = 1;

        this.drawingService.baseCtx.translate(center.x, center.y);

        this.drawingService.baseCtx.scale(this.resizeFactor, this.resizeFactor);
        this.drawingService.baseCtx.translate(-this.size / 2, -this.size / 2);

        this.drawingService.baseCtx.rotate(-((this.angle * Math.PI) / ANGLE_HALF_TURN));
        this.drawingService.baseCtx.translate(-this.size / 2, -this.size / 2);

        console.log(this.resizeFactor);
        

        this.drawingService.baseCtx.drawImage(
            img,
            0,
            0,
            this.size,
            this.size,
        );

        this.drawingService.baseCtx.setTransform(1, 0, 0, 1, 0, 0);*/
        let img = new Image(this.size, this.size);
        img.src = MOST_LIKED;

        const realStampWidth = this.size * this.resizeFactor;
        const realStampHeight = this.size * this.resizeFactor;
        let ctx = this.drawingService.baseCtx;
        ctx.save();
        ctx.translate(this.imageCoords.x + realStampWidth / 2, this.imageCoords.y + realStampHeight / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.imageCoords.x - realStampWidth / 2, -this.imageCoords.y - realStampHeight / 2);
        ctx.drawImage(
            img,
            this.imageCoords.x -
                (realStampWidth / 2) *
                    (Math.cos(this.angle) + Math.sin(this.angle)),
            this.imageCoords.y -
                (realStampHeight / 2) *
                    (Math.cos(this.angle) - Math.sin(this.angle)),
            realStampWidth,
            realStampHeight,
        );
        ctx.restore();
    }

    private previewCursor(event: Vec2): void {
        /*this.drawingService.clearCanvas(this.drawingService.cursorCtx);

        if (this.srcBinding.has(this.currentStamp)) {
            this.imageSrc = this.srcBinding.get(this.currentStamp)!;
        }

        const path = new Path2D(this.imageSrc);
        const center: Vec2 = { x: event.x + this.size / 2, y: event.y + this.size / 2 };

        this.drawingService.cursorCtx.translate(center.x, center.y);

        this.drawingService.cursorCtx.scale(this.resizeFactor, this.resizeFactor);
        this.drawingService.cursorCtx.translate(-this.size / 2, -this.size / 2);

        this.drawingService.cursorCtx.rotate(-((this.angle * Math.PI) / ANGLE_HALF_TURN));
        this.drawingService.cursorCtx.translate(-this.size / 2, -this.size / 2);

        this.drawingService.cursorCtx.stroke(path);
        this.drawingService.cursorCtx.fill(path);
        this.drawingService.cursorCtx.setTransform(1, 0, 0, 1, 0, 0);*/
    }
}