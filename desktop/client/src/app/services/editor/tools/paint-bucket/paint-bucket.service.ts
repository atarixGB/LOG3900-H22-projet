// Code Inspired by:
// W. Malone. (2012) Create a paint bucket tool in HTML5 and javascript. [Online]
// Available : http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MAX_DEC_RANGE, MouseButton } from '@app/constants/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { RGBA, RGBA_INDEX } from '@app/interfaces-enums/rgba';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';

const RGBA_COMPONENTS = 4;
const MAX_BYTE_VALUE = 255;
const MAX_PERCENT = 100;
const MAX_TOLERANCE_VALUE = 100;
const MIN_TOLERANCE_VALUE = 0;
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    startPixelColor: Uint8ClampedArray;
    maxTolerance: number;
    minTolerance: number;
    tolerance: number;
    mouseDownCoord: Vec2;
    canvasData: ImageData;
    isContiguous: boolean;

    constructor(protected drawingService: DrawingService, private colorManager: ColorManagerService) {
        super(drawingService);
        this.maxTolerance = MAX_TOLERANCE_VALUE;
        this.minTolerance = MIN_TOLERANCE_VALUE;
        this.tolerance = MIN_TOLERANCE_VALUE;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);

        this.startPixelColor = this.drawingService.getPixelData(this.mouseDownCoord);
        if (event.button === MouseButton.Left) {
            this.drawingService.baseCtx.fillStyle = this.colorManager.selectedColor[ColorOrder.PrimaryColor].inString;
            this.contiguousFill();
        } else if (event.button === MouseButton.Right) {
            this.fill();
        }
    }
    setToleranceValue(newTolerance: number): void {
        this.tolerance = newTolerance;
    }

    fill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const canvasData = this.drawingService.getCanvasData();
        const rgbaPrimaryColor: RGBA = this.colorManager.selectedColor[ColorOrder.PrimaryColor];
        for (let i = 0; i < canvasData.data.length; i += RGBA_COMPONENTS) {
            if (this.ToleranceRangeVerification(pixelData, canvasData, i)) {
                canvasData.data[i + RGBA_INDEX.RED] = rgbaPrimaryColor.Dec.Red;
                canvasData.data[i + RGBA_INDEX.GREEN] = rgbaPrimaryColor.Dec.Green;
                canvasData.data[i + RGBA_INDEX.BLUE] = rgbaPrimaryColor.Dec.Blue;
                canvasData.data[i + RGBA_INDEX.ALPHA] = MAX_DEC_RANGE;
            }
        }
        this.canvasData = canvasData;
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
        this.isContiguous = false;
    }

    contiguousFill(): void {
        const pixelData = this.drawingService.getPixelData(this.mouseDownCoord);
        const stackPos: Vec2[] = [this.mouseCoord];
        const coloredPixels: Map<string, boolean> = new Map();
        const canvasData: ImageData = this.drawingService.getCanvasData();

        const rgbaPrimaryColor: RGBA = this.colorManager.selectedColor[ColorOrder.PrimaryColor];
        while (stackPos.length) {
            const selectedPixel = stackPos.pop() as Vec2;
            const index = (selectedPixel.x + selectedPixel.y * this.drawingService.canvas.width) * RGBA_COMPONENTS;
            if (coloredPixels.has(this.vec2ToString(selectedPixel))) {
                continue;
            } else if (this.ToleranceRangeVerification(pixelData, canvasData, index)) {
                canvasData.data[index + RGBA_INDEX.RED] = rgbaPrimaryColor.Dec.Red;
                canvasData.data[index + RGBA_INDEX.GREEN] = rgbaPrimaryColor.Dec.Green;
                canvasData.data[index + RGBA_INDEX.BLUE] = rgbaPrimaryColor.Dec.Blue;
                canvasData.data[index + RGBA_INDEX.ALPHA] = MAX_DEC_RANGE;
                coloredPixels.set(this.vec2ToString(selectedPixel), true);
                if (selectedPixel.y - 1 >= 0) {
                    stackPos.push({ x: selectedPixel.x, y: selectedPixel.y - 1 });
                }
                if (selectedPixel.y + 1 < this.drawingService.canvas.height) {
                    stackPos.push({ x: selectedPixel.x, y: selectedPixel.y + 1 });
                }
                if (selectedPixel.x + 1 < this.drawingService.canvas.width) {
                    stackPos.push({ x: selectedPixel.x + 1, y: selectedPixel.y });
                }
                if (selectedPixel.x - 1 >= 0) {
                    stackPos.push({ x: selectedPixel.x - 1, y: selectedPixel.y });
                }
            }
        }
        this.canvasData = canvasData;
        this.isContiguous = true;
        this.drawingService.baseCtx.putImageData(canvasData, 0, 0);
    }

    vec2ToString(pixel: Vec2): string {
        return pixel.x.toString() + ',' + pixel.y.toString();
    }

    ToleranceRangeVerification(pixelData: Uint8ClampedArray, canvasData: ImageData, index: number): boolean {
        const diffRed: number = Math.abs(pixelData[RGBA_INDEX.RED] - canvasData.data[index + RGBA_INDEX.RED]);
        const diffGreen: number = Math.abs(pixelData[RGBA_INDEX.GREEN] - canvasData.data[index + RGBA_INDEX.GREEN]);
        const diffBlue: number = Math.abs(pixelData[RGBA_INDEX.BLUE] - canvasData.data[index + RGBA_INDEX.BLUE]);
        const diffAlpha: number = Math.abs(pixelData[RGBA_INDEX.ALPHA] - canvasData.data[index + RGBA_INDEX.ALPHA]);

        const diffPercentage: number = ((diffRed + diffGreen + diffBlue + diffAlpha) / (RGBA_COMPONENTS * MAX_BYTE_VALUE)) * MAX_PERCENT;

        if (diffPercentage > this.tolerance) {
            return false;
        }
        return true;
    }
}
