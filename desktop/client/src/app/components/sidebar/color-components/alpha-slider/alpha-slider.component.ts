// Code used for this section is from an External Source
// Lukas Marx (2018) Creating a Color Picker Component with Angular
// Available at : https://github.com/LukasMarx/angular-color-picker
// constructed on the base of the color slider component
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Vec2 } from 'src/app/classes/vec2';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

const WIDTH = 20;
const HEIGHT = 200;

@Component({
    selector: 'app-alpha-slider',
    templateUrl: './alpha-slider.component.html',
    styleUrls: ['./alpha-slider.component.scss'],
})
export class AlphaSliderComponent implements OnChanges, AfterViewInit {
    @ViewChild('alphaSlider', { static: false })
    colorSliderCanvas: ElementRef;
    colorSliderContext: CanvasRenderingContext2D;

    private gradientToBottom: CanvasGradient;
    @Input() shouldUpdateGradient: string;
    @Input() shouldUpdateForAlpha: string;

    constructor(@Inject(MAT_DIALOG_DATA) public colorOrder: ColorOrder, private colorManager: ColorManagerService) {}

    ngAfterViewInit(): void {
        this.createAlphaGradiantDisplayer();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.shouldUpdateGradient) {
            if (!changes.shouldUpdateGradient.isFirstChange()) {
                this.colorSliderContext.clearRect(0, 0, WIDTH, HEIGHT);
                this.createAlphaGradiantDisplayer();
            }
        }
        if (changes.shouldUpdateForAlpha) {
            if (!changes.shouldUpdateForAlpha.isFirstChange()) {
                this.colorSliderContext.clearRect(0, 0, WIDTH, HEIGHT);
                this.createAlphaGradiantDisplayer();
            }
        }
    }

    createAlphaGradiantDisplayer(): void {
        this.colorSliderContext = this.colorSliderCanvas.nativeElement.getContext('2d');
        this.gradientToBottom = this.colorSliderContext.createLinearGradient(0, 0, 0, HEIGHT);
        this.gradientToBottom.addColorStop(0, this.colorManager.getColorStringAlpha(this.colorOrder, true));
        this.gradientToBottom.addColorStop(1, this.colorManager.getColorStringAlpha(this.colorOrder, false));
        this.colorSliderContext.beginPath();
        this.colorSliderContext.rect(0, 0, WIDTH, HEIGHT);
        this.colorSliderContext.fillStyle = this.gradientToBottom;
        this.colorSliderContext.fill();
        this.colorSliderContext.closePath();
    }

    updateColorWithCoordinates(coordinates: Vec2): void {
        const colorPixel = this.colorSliderContext.getImageData(coordinates.x, coordinates.y, 1, 1).data;
        if (colorPixel) {
            this.colorManager.updatePixelColor(this.colorOrder, colorPixel);
        }
    }

    mouseDownFromGradient(event: MouseEvent): void {
        const coordinates: Vec2 = { x: event.offsetX, y: event.offsetY };
        this.updateColorWithCoordinates(coordinates);
    }
}
