import { EventEmitter, Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/constants';
import { ColorOrder } from '@app/interfaces-enums/color-order';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const ZOOM_RADIUS = 75;
const ZOOM_RATIO = 0.2;
@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    pixelColor: string[];
    primaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    secondaryColor: EventEmitter<string[]> = new EventEmitter<string[]>();
    zoom: HTMLCanvasElement;
    zoomCtx: CanvasRenderingContext2D;
    isNearBorder: boolean = false;

    constructor(drawingService: DrawingService, public colorManagerService: ColorManagerService) {
        super(drawingService);
        this.pixelColor = ['#000000', '0'];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        const pixelData = this.pixelOnZoom(event);

        if (event.button === MouseButton.Left) {
            this.colorManagerService.updatePixelColor(ColorOrder.PrimaryColor, pixelData);
            this.primaryColor.emit(this.pixelColor);
        }
        if (event.button === MouseButton.Right) {
            this.colorManagerService.updatePixelColor(ColorOrder.SecondaryColor, pixelData);
            this.secondaryColor.emit(this.pixelColor);
        }
    }

    pixelOnZoom(event: MouseEvent): Uint8ClampedArray {
        const x = this.getPositionFromMouse(event).x;
        const y = this.getPositionFromMouse(event).y;
        const red = 0;
        const green = 1;
        const blue = 2;
        const alpha = 3;

        const pixelData = this.drawingService.baseCtx.getImageData(x, y, 1, 1).data;

        this.pixelColor[0] = pixelData[red].toString() + pixelData[green].toString() + pixelData[blue].toString();
        this.pixelColor[1] = pixelData[alpha].toString();

        return pixelData;
    }

    drawOnZoom(event: MouseEvent): void {
        const x = this.getPositionFromMouse(event).x;
        const y = this.getPositionFromMouse(event).y;

        const hSource = this.zoom.height;
        const wSource = this.zoom.width;

        this.zoomCtx.beginPath();
        this.zoomCtx.arc(this.zoom.width / 2, this.zoom.height / 2, ZOOM_RADIUS, 0, 2 * Math.PI);
        this.zoomCtx.clip();
        this.zoomCtx.drawImage(
            this.drawingService.canvas,
            x - (wSource / 2) * ZOOM_RATIO,
            y - (hSource / 2) * ZOOM_RATIO,
            wSource * ZOOM_RATIO,
            hSource * ZOOM_RATIO,
            0,
            0,
            this.zoom.width,
            this.zoom.height,
        );
        this.zoomCtx.strokeRect(this.zoom.width / 2, this.zoom.height / 2, 1 / ZOOM_RATIO, 1 / ZOOM_RATIO);
        this.zoomCtx.closePath();
    }

    nearBorder(mousePosition: Vec2): void {
        this.isNearBorder = false;
        if (mousePosition.x >= this.drawingService.canvas.width || mousePosition.x <= 0) {
            this.isNearBorder = true;
        }
        if (mousePosition.y >= this.drawingService.canvas.height || mousePosition.y <= 0) {
            this.isNearBorder = true;
        }
        if (this.isNearBorder) {
            this.clearCanvas();
        }
    }

    clearCanvas(): void {
        this.zoomCtx.clearRect(0, 0, this.zoom.width, this.zoom.height);
    }

    showZoom(event: MouseEvent): void {
        this.clearCanvas();
        if (!this.isNearBorder) {
            this.drawOnZoom(event);
        }
    }
    onMouseMove(event: MouseEvent): void {
        this.nearBorder(this.getPositionFromMouse(event));
        this.showZoom(event);
    }
}
