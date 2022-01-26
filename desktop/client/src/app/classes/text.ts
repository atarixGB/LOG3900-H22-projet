import { Drawable } from './drawable';

export class TextTool extends Drawable {
    private image: ImageData;

    constructor(img: ImageData) {
        super();
        this.image = img;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.image, 0, 0);
    }
}
