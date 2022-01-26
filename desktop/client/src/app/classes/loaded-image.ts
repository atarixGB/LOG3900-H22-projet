import { Drawable } from './drawable';

export class LoadedImage extends Drawable {
    src: ImageData;

    constructor(src?: ImageData) {
        super();
        this.src = src as ImageData;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.src) {
            ctx.putImageData(this.src, 0, 0);
        }
    }
}
