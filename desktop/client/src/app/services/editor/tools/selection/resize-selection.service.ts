import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { Vec2 } from '@app/classes/vec2';

const MIN_WIDTH = 2;
const MIN_HEIGHT = 2;

@Injectable({
    providedIn: 'root',
})
export class ResizeSelectionService {
    selectionCnv: HTMLCanvasElement;
    selectionCtx: CanvasRenderingContext2D;
    stroke: Stroke;
    oldMousePos: Vec2;
    scale: Vec2;
    currentCpIndex: number;
    deltaSize: Vec2;
    deltaPos: Vec2;
    selectionCPs: HTMLElement[];
    currentCp: HTMLElement;

    constructor() {}

    setSelectionCnv(
        selectCnv: HTMLCanvasElement,
        selectCtx: CanvasRenderingContext2D,
        cps: HTMLElement[],
        stroke: Stroke,
    ): void {
        this.selectionCnv = selectCnv;
        this.selectionCtx = selectCtx;
        this.selectionCPs = cps;
        this.stroke = stroke;
    }

    onMouseDown(event: MouseEvent): void {
        this.currentCp = event.target as HTMLElement;
        this.setCurrentCpIndex();
        this.oldMousePos = { x: event.x, y: event.y };
    }

    onMouseMove(event: MouseEvent): void {
        this.calculateDelta(event);
        this.oldMousePos = { x: event.x, y: event.y };
        this.resizeSelection();
    }

    private setCurrentCpIndex(): void {
      this.currentCpIndex = this.selectionCPs.indexOf(this.currentCp);
    }

    private calculateDelta(event: MouseEvent): void {
        this.deltaSize = { x: event.x - this.oldMousePos.x, y: event.y - this.oldMousePos.y };
        this.deltaPos = { x: event.x - this.oldMousePos.x, y: event.y - this.oldMousePos.y };
    }

    private resizeSelection(): void {
        this.adjustDeltasAccordingToCp();
        this.applyDeltasToSelection();
        this.rescaleStroke();
    }

    private adjustDeltasAccordingToCp(): void {
        switch (this.currentCpIndex) {
            case 0: {
                this.deltaSize.x = -this.deltaSize.x;
                this.deltaSize.y = -this.deltaSize.y;
                break;
            }
            case 1: {
                this.deltaSize.y = -this.deltaSize.y;
                this.deltaPos.x = 0;
                break;
            }
            case 2: {
                this.deltaSize.x = -this.deltaSize.x;
                this.deltaPos.y = 0;
                break;
            }
            case 3: {
                this.deltaPos.x = 0;
                this.deltaPos.y = 0;
                break;
            }
        }
    }

    private applyDeltasToSelection(): void {
        const oldWidth = this.selectionCnv.width;
        const oldHeight = this.selectionCnv.height;
        let newWidth = oldWidth;
        let newHeight = oldHeight;

        if (this.selectionCnv.width + this.deltaSize.x > MIN_WIDTH) {
          this.selectionCnv.width = this.selectionCnv.width + this.deltaSize.x;
          this.selectionCnv.style.left = (this.selectionCnv.offsetLeft + this.deltaPos.x).toString() + 'px';
          newWidth = this.selectionCnv.width;
        }
        if (this.selectionCnv.height + this.deltaSize.y > MIN_HEIGHT) {
          this.selectionCnv.height = this.selectionCnv.height + this.deltaSize.y;
          this.selectionCnv.style.top = (this.selectionCnv.offsetTop + this.deltaPos.y).toString() + 'px';
          newHeight = this.selectionCnv.height;
        }

        this.scale = { x: newWidth / oldWidth, y: newHeight / oldHeight };
    }

    private rescaleStroke(): void {
      this.stroke.rescale(this.scale);
      this.stroke.drawStroke(this.selectionCtx);
    }
}
