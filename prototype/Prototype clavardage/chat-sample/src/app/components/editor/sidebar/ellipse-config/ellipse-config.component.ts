import { Component } from '@angular/core';
import { EllipseService } from '@app/services/editor/tools/ellipse/ellipse.service';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent {
    ellipseService: EllipseService;

    constructor(ellipseService: EllipseService) {
        this.ellipseService = ellipseService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
