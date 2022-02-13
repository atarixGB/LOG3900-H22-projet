import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

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

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (context === this.baseCtx) {
            this.baseCtx.beginPath();
            this.baseCtx.fillStyle = '#FFFFFF';
            this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.baseCtx.closePath();
        }
    }

    getCanvasData(): ImageData {
        return this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    getPixelData(pixelCoord: Vec2): Uint8ClampedArray {
        return this.baseCtx.getImageData(pixelCoord.x, pixelCoord.y, 1, 1).data;
    }
}
