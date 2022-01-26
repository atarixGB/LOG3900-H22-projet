import { DrawingService } from '@app/services/drawing/drawing.service';
import { Drawable } from './drawable';

export class Resize extends Drawable {
    private image: HTMLImageElement;
    private width: number;
    private height: number;
    private originalWidth: number;
    private originalHeight: number;

    constructor(
        private drawingServing: DrawingService,
        image: HTMLImageElement,
        originalWidth: number,
        originalHeight: number,
        width: number,
        height: number,
    ) {
        super();
        this.image = image;
        this.width = width;
        this.height = height;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawingServing.previewCanvas.width += this.width;
        this.drawingServing.previewCanvas.height += this.height;
        ctx.drawImage(this.image, 0, 0);
    }
    undraw(): void {
        this.drawingServing.previewCanvas.width = this.originalWidth;
        this.drawingServing.previewCanvas.height = this.originalHeight;
    }
}
