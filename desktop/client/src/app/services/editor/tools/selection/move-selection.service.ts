import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';


@Injectable({
    providedIn: 'root',
})
export class MoveSelectionService {
    canvasLeft: number;
    canvasRight: number;
    canvasTop: number;
    canvasBottom: number;
    moveInterval: number;
    selectionCnv: HTMLCanvasElement;
    originalCnv: HTMLCanvasElement;
    selectionCtx: CanvasRenderingContext2D;
    oldMousePos: Vec2;

    constructor() {}

    setSelectionCnv(cnv: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
        this.selectionCnv = cnv;
        this.originalCnv = document.createElement('canvas');
        this.originalCnv.width = cnv.width;
        this.originalCnv.height = cnv.height;
        const originalCtx = this.originalCnv.getContext('2d');
        if (originalCtx) {
            originalCtx.drawImage(cnv, 0, 0);
        }
        this.selectionCtx = ctx;
    }

    setCanvasCorners(left: number, top: number, width: number, height: number): void {
        this.canvasBottom = top + height;
        this.canvasLeft = left;
        this.canvasRight = left + width;
        this.canvasTop = top;
    }

    onMouseMove(event: MouseEvent): void {
        const delta = this.calculateMovement(event);
        this.oldMousePos = { x: event.x, y: event.y };
        this.moveSelectionCanvas(delta);
    }

    cropSelectionCanvas(): void {
        const boundL = this.selectionCnv.getBoundingClientRect().left;
        const boundU = this.selectionCnv.getBoundingClientRect().top;
        const boundR = boundL + this.selectionCnv.width;
        const boundD = boundU + this.selectionCnv.height;
        const outLeft: boolean = boundL < this.canvasLeft;
        const outTop: boolean = boundU < this.canvasTop;
        const outRight: boolean = boundR > this.canvasRight;
        const outBottom: boolean = boundD > this.canvasBottom;
        this.selectionCtx.clearRect(0, 0, this.selectionCnv.width, this.selectionCnv.height);
        if (outLeft || outRight || outBottom || outTop) {
            const sx: number = outLeft ? this.canvasLeft - boundL : 0;
            const sy: number = outTop ? this.canvasTop - boundU : 0;
            const sWidth = outRight ? this.selectionCnv.width - (boundR - this.canvasRight) : this.selectionCnv.width - sx;
            const sHeight = outBottom ? this.selectionCnv.height - (boundD - this.canvasBottom) : this.selectionCnv.height - sy;

            this.selectionCtx.drawImage(this.originalCnv, sx, sy, sWidth, sHeight, sx, sy, sWidth, sHeight);
        } else {
            this.selectionCtx.drawImage(this.originalCnv, 0, 0, this.selectionCnv.width, this.selectionCnv.height);
        }
    }

    private calculateMovement(event: MouseEvent): Vec2 {
        return { x: event.x - this.oldMousePos.x, y: event.y - this.oldMousePos.y };
    }

    private moveSelectionCanvas(delta: Vec2): void {
        this.selectionCnv.style.left = (this.selectionCnv.offsetLeft + delta.x).toString() + 'px';
        this.selectionCnv.style.top = (this.selectionCnv.offsetTop + delta.y).toString() + 'px';
        this.cropSelectionCanvas();
    }
}
