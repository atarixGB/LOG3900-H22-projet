import { Drawable } from './drawable';

export class PaintBucket extends Drawable {
    isContiguous: boolean;
    private image: ImageData;

    constructor(isContiguous: boolean, img: ImageData) {
        super();
        this.isContiguous = isContiguous;
        this.image = img;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.image, 0, 0);
    }
}
