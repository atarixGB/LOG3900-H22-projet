import { Component } from '@angular/core';
import { PaintBucketService } from '@app/services/editor-services/tools/paint-bucket/paint-bucket.service';

@Component({
    selector: 'app-paint-config',
    templateUrl: './paint-config.component.html',
    styleUrls: ['./paint-config.component.scss'],
})
export class PaintConfigComponent {
    tolerance: number;

    constructor(public paintBucketService: PaintBucketService) {
        this.tolerance = paintBucketService.tolerance;
    }

    setToleranceValue(newValue: number): void {
        this.tolerance = newValue;
        this.paintBucketService.setToleranceValue(this.tolerance);
    }
}