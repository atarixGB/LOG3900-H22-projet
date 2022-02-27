import { Stroke } from './stroke';
import { Vec2 } from './vec2';

export class StrokeRectangle extends Stroke {
    secondaryColor: string;
    topLeftCorner: Vec2;
    width: number;
    height: number;
    type: string;

    constructor(color: string, strokeWidth: number, secondaryColor: string, topLeftCorner: Vec2, width: number, height: number, type: string) {
        super(color, strokeWidth);
        this.secondaryColor = secondaryColor;
        this.topLeftCorner = topLeftCorner;
        this.width = width;
        this.height = height;
        this.type = type;
    }
}
