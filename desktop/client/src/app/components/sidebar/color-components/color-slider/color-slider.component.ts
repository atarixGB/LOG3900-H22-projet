// Code used for this section is from an External Source
// Lukas Marx (2018) Creating a Color Picker Component with Angular
// Available at : https://github.com/LukasMarx/angular-color-picker
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Vec2 } from 'src/app/classes/vec2';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const WIDTH = 20;
const HEIGHT = 200;
const ONE_SIX = 0.17;
const ONE_THREE = 0.33;
const ONE_TWO = 0.5;
const TWO_THREE = 0.67;
const FIVE_SIX = 0.83;
@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('colorSlider', { static: false })
    colorSliderCanvas: ElementRef;
    colorSliderContext: CanvasRenderingContext2D;

    @Output() shouldUpdateGradient: EventEmitter<string> = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public colorOrder: ColorOrder, private colorManager: ColorManagerService) {}

    ngAfterViewInit(): void {
        this.createAllGradiantDisplayer();
    }

    private createAllGradiantDisplayer(): void {
        this.colorSliderContext = this.colorSliderCanvas.nativeElement.getContext('2d');
        const gradientToBottom = this.colorSliderContext.createLinearGradient(0, 0, 0, HEIGHT);
        gradientToBottom.addColorStop(0, 'rgba(255,0,0,1)');
        gradientToBottom.addColorStop(ONE_SIX, 'rgba(255,255,0,1)');
        gradientToBottom.addColorStop(ONE_THREE, 'rgba(0,255,0,1)');
        gradientToBottom.addColorStop(ONE_TWO, 'rgba(0,255,255,1)');
        gradientToBottom.addColorStop(TWO_THREE, 'rgba(0,0,255,1)');
        gradientToBottom.addColorStop(FIVE_SIX, 'rgba(255,0,255,1)');
        gradientToBottom.addColorStop(1, 'rgba(255,0,0,1)');
        this.colorSliderContext.beginPath();
        this.colorSliderContext.rect(0, 0, WIDTH, HEIGHT);
        this.colorSliderContext.fillStyle = gradientToBottom;
        this.colorSliderContext.fill();
        this.colorSliderContext.closePath();
    }

    upgradeColorCoord(coord: Vec2): void {
        const colorPixel = this.colorSliderContext.getImageData(coord.x, coord.y, 1, 1).data;

        if (colorPixel) {
            this.colorManager.updatePixelColor(this.colorOrder, colorPixel);
        }
    }

    mouseDownFromGradient(event: MouseEvent): void {
        const coord: Vec2 = { x: event.offsetX, y: event.offsetY };
        this.upgradeColorCoord(coord);
        this.shouldUpdateGradient.emit(this.colorManager.selectedColor[this.colorOrder].inString);
    }
}
