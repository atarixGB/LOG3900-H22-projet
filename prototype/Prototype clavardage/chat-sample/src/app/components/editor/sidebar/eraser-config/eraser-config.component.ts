import { Component } from '@angular/core';
import { EraserService } from '@app/services/editor-services/tools/eraser/eraser.service';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent {
    constructor(public eraserService: EraserService) {}

    formatLabel(value: number): string {
        return value + 'px';
    }
}
