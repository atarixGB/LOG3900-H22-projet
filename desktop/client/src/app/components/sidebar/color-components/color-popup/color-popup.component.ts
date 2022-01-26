import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';

@Component({
    selector: 'app-color-pop',
    templateUrl: './color-popup.component.html',
    styleUrls: ['./color-popup.component.scss'],
})
export class ColorPopupComponent {
    colorPreviewContext: CanvasRenderingContext2D;
    selectedColor: RGBA;
    colorHistory: RGBA[];
    shouldUpdateGradient: string;
    shouldUpdateForAlpha: string;

    constructor(
        public dialogRef: MatDialogRef<ColorPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ColorOrder,
        private colorManager: ColorManagerService,
    ) {
        this.selectedColor = this.colorManager.selectedColor[this.data];
        this.colorHistory = this.colorManager.lastColors;
    }

    closeWindow(): void {
        this.dialogRef.close();
    }

    updateHex(): void {
        this.colorManager.updateWithHex(this.data, this.selectedColor);
    }

    mouseClickOnHistory(event: MouseEvent, colorElement: RGBA): void {
        event.preventDefault();
        const cloneColor: RGBA = JSON.parse(JSON.stringify(colorElement));
        if (event.buttons === 1) {
            this.colorHistory.splice(this.colorHistory.indexOf(colorElement), 1);
            this.colorManager.updateRGBAColor(ColorOrder.PrimaryColor, cloneColor, false);
        } else if (event.button === 2) {
            this.colorHistory.splice(this.colorHistory.indexOf(colorElement), 1);
            this.colorManager.updateRGBAColor(ColorOrder.SecondaryColor, cloneColor, false);
        }
    }

    contextMenu(event: MouseEvent): void {
        return event.preventDefault();
    }
}
