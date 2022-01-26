import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

const MAX_PERCENT = 100;
@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    gridCtx: CanvasRenderingContext2D;
    cursorCtx: CanvasRenderingContext2D;
    lassoPreviewCtx: CanvasRenderingContext2D;
    gridSpaces: number;
    gridOpacity: number;
    isGridEnabled: boolean;
    canvas: HTMLCanvasElement;
    gridCanvas: HTMLCanvasElement;
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

    setGrid(): void {
        this.clearCanvas(this.gridCtx);
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        this.gridCtx.beginPath();
        for (let x = 0; x <= canvasWidth; x += this.gridSpaces) {
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, canvasHeight);
        }

        for (let x = 0; x <= canvasHeight; x += this.gridSpaces) {
            this.gridCtx.moveTo(0, x);
            this.gridCtx.lineTo(canvasWidth, x);
        }
        this.gridCtx.globalAlpha = this.gridOpacity / MAX_PERCENT;
        this.gridCtx.strokeStyle = 'black';
        this.gridCtx.closePath();
        this.gridCtx.stroke();
    }
}
