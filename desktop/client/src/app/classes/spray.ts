import { Drawable } from './drawable';

export class Spray extends Drawable {
    image: ImageData;
    constructor(image: ImageData) {
        super();

        this.image = image;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.image, 0, 0);
    }
}
