import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Eraser extends Drawable {
    private size: number;
    private pathData: Vec2[];

    constructor(size: number, pathData: Vec2[]) {
        super();
        this.size = size;
        this.pathData = pathData;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'square';
        ctx.lineWidth = this.size;
        ctx.fillStyle = 'rgba(255,255,255,1';
        ctx.strokeStyle = 'rgba(255,255,255,1)';

        ctx.beginPath();
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}
