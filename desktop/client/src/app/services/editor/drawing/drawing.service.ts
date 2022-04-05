import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { IDrawing } from '@app/interfaces-enums/IDrawing';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    cursorCtx: CanvasRenderingContext2D;
    lassoPreviewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;

    currentDrawing: HTMLImageElement; 

    constructor() {}

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getCanvasData(): ImageData {
        return this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    getPixelData(pixelCoord: Vec2): Uint8ClampedArray {
        return this.baseCtx.getImageData(pixelCoord.x, pixelCoord.y, 1, 1).data;
    }

    setCurrentDrawingBlanc(): void {
        this.baseCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currentDrawing = new Image();
        this.currentDrawing.src = this.canvas.toDataURL();
    }

    setCurrentDrawing(drawing: IDrawing): void {
        this.currentDrawing = new Image();
        this.currentDrawing.src = 'data:image/png;base64,' + drawing.data;
    }

    loadCurrentDrawing(): void {
        this.clearCanvas(this.baseCtx);
        this.baseCtx.drawImage(this.currentDrawing, 0, 0);
    }
}
