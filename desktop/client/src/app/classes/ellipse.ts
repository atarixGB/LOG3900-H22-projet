import { TypeStyle } from '@app/interfaces-enums/type-style';
import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Ellipse extends Drawable {
    private center: Vec2;
    private radiusX: number;
    private radiusY: number;
    private type: TypeStyle;
    private lineWidth: number;
    private primaryColor: string;
    private secondaryColor: string;

    constructor(center: Vec2, width: number, height: number, type: TypeStyle, lineWidth: number, primaryColor: string, secondaryColor: string) {
        super();
        this.center = center;
        this.radiusX = width;
        this.radiusY = height;
        this.type = type;
        this.lineWidth = lineWidth;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.secondaryColor;
        ctx.fillStyle = this.primaryColor;
        ctx.ellipse(this.center.x, this.center.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);

        switch (this.type) {
            case TypeStyle.Stroke:
                ctx.stroke();
                break;

            case TypeStyle.Fill:
                ctx.fill();
                break;

            case TypeStyle.StrokeFill:
                ctx.fill();
                ctx.stroke();
                break;
        }
        ctx.closePath();
    }
}
