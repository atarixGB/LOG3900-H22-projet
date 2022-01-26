import { Drawable } from '@app/classes/drawable';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { Vec2 } from './vec2';

export class Polygon extends Drawable {
    private centerCircle: Vec2;
    private radius: number;
    private polySides: number;
    private type: string;
    private lineWidth: number;
    private primaryColor: string;
    private secondaryColor: string;

    constructor(center: Vec2, radius: number, polySides: number, type: string, lineWidth: number, primaryColor: string, secondaryColor: string) {
        super();
        this.centerCircle = center;
        this.radius = radius;
        this.polySides = polySides;
        this.type = type;
        this.lineWidth = lineWidth;
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const finalRadius = Math.abs(this.radius - this.lineWidth / 2 - this.lineWidth / this.polySides);

        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.secondaryColor;
        ctx.fillStyle = this.primaryColor;
        ctx.moveTo(this.centerCircle.x + finalRadius * Math.cos(-Math.PI / 2), this.centerCircle.y + finalRadius * Math.sin(-Math.PI / 2));
        for (let i = 1; i <= this.polySides + 1; i++) {
            ctx.lineTo(
                this.centerCircle.x + finalRadius * Math.cos((i * 2 * Math.PI) / this.polySides - Math.PI / 2),
                this.centerCircle.y + finalRadius * Math.sin((i * 2 * Math.PI) / this.polySides - Math.PI / 2),
            );
        }

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
