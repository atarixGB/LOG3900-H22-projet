import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';

export class StrokeRectangle extends Stroke {
    secondaryColor: string;
    topLeftCorner: Vec2;
    width: number;
    height: number;
    shapeType: string;

    constructor(color: string, strokeWidth: number, secondaryColor: string, topLeftCorner: Vec2, width: number, height: number, shapeType: string) {
        super('rectangle', color, strokeWidth);
        this.secondaryColor = secondaryColor;
        this.topLeftCorner = topLeftCorner;
        this.width = width;
        this.height = height;
        this.shapeType = shapeType;
    }
}
