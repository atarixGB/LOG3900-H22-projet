import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Pencil extends Drawable {
    private pathData: Vec2[] = [];
    private color: string;
    private lineWidth: number;
    constructor(pathData: Vec2[], color: string, lineWidth: number) {
        super();
        this.pathData = pathData;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineWidth = this.lineWidth;
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
}
