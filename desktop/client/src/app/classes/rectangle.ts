import { TypeStyle } from '@app/interfaces-enums/type-style';
import { Drawable } from './drawable';
import { Vec2 } from './vec2';

export class Rectangle extends Drawable {
    private leftFinalpoint: Vec2;
    private width: number;
    private height: number;
    private type: TypeStyle;
    private lineWidth: number;
    private primaryColor: string;
    private secondaryColor: string;

    constructor(finalPoint: Vec2, width: number, height: number, type: TypeStyle, lineWidth: number, primaryColor: string, secondaryColor: string) {
        super();
        this.leftFinalpoint = finalPoint;
        this.width = width;
        this.height = height;
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

        switch (this.type) {
            case TypeStyle.Stroke:
                ctx.strokeRect(this.leftFinalpoint.x, this.leftFinalpoint.y, this.width, this.height);

                break;

            case TypeStyle.Fill:
                ctx.fillRect(this.leftFinalpoint.x, this.leftFinalpoint.y, this.width, this.height);
                break;

            case TypeStyle.StrokeFill:
                ctx.fillRect(this.leftFinalpoint.x, this.leftFinalpoint.y, this.width, this.height);
                ctx.strokeRect(this.leftFinalpoint.x, this.leftFinalpoint.y, this.width, this.height);
                break;
        }
        ctx.closePath();
    }
}
