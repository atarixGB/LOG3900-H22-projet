import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';
import { drawStrokeRectangle } from './stroke-drawer';

export class StrokeRectangle extends Stroke {
    secondaryColor: string;
    topLeftCorner: Vec2;
    width: number;
    height: number;
    shapeType: string;

    constructor(
        boundingPoints: Vec2[],
        color: string,
        strokeWidth: number,
        secondaryColor: string,
        topLeftCorner: Vec2,
        width: number,
        height: number,
        shapeType: string,
    ) {
        super('rectangle', boundingPoints, color, strokeWidth);
        this.secondaryColor = secondaryColor;
        this.topLeftCorner = topLeftCorner;
        this.width = width;
        this.height = height;
        this.shapeType = shapeType;
    }

    drawStroke(ctx: CanvasRenderingContext2D): void {
        drawStrokeRectangle(this, ctx);
    }

    prepForSelection(): void {
        this.topLeftCorner = {x: 0, y: 0};
    }
}
