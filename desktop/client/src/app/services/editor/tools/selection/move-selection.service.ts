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
    selectionCPs: HTMLElement[];


    constructor() {}

    setSelectionCnv(cnv: HTMLCanvasElement, ctx: CanvasRenderingContext2D, cps: HTMLElement[]): void {
        this.selectionCnv = cnv;
        this.originalCnv = document.createElement('canvas');
        this.originalCnv.width = cnv.width;
        this.originalCnv.height = cnv.height;
        const originalCtx = this.originalCnv.getContext('2d');
        if (originalCtx) {
            originalCtx.drawImage(cnv, 0, 0);
        }
        this.selectionCtx = ctx;
        this.selectionCPs = cps;
    }

    onMouseDown(event: MouseEvent): void {
        this.oldMousePos = { x: event.x, y: event.y };
    }

    onMouseMove(event: MouseEvent): void {
        const delta = this.calculateMovement(event);
        this.oldMousePos = { x: event.x, y: event.y };
        this.moveSelectionCanvas(delta);
    }

    private calculateMovement(event: MouseEvent): Vec2 {
        return { x: event.x - this.oldMousePos.x, y: event.y - this.oldMousePos.y };
    }

    private moveSelectionCanvas(delta: Vec2): void {
        this.selectionCnv.style.left = (this.selectionCnv.offsetLeft + delta.x).toString() + 'px';
        this.selectionCnv.style.top = (this.selectionCnv.offsetTop + delta.y).toString() + 'px';
        //this.moveSelectionCps(delta);
    }

    /*private moveSelectionCps(delta: Vec2) {
        this.selectionCPs.forEach(cp => {
            cp.style.left = (cp.offsetLeft + delta.x).toString() + 'px';
            cp.style.top = (cp.offsetTop + delta.y).toString() + 'px';
        });
    }*/
}
