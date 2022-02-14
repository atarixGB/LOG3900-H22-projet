import { Component } from '@angular/core';
import { RectangleService } from '@app/services/editor-services/tools/rectangle/rectangle.service';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent {
    rectangleService: RectangleService;

    constructor(rectangleService: RectangleService) {
        this.rectangleService = rectangleService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
