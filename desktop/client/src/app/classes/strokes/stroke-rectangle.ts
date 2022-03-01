import { Vec2 } from '@app/classes/vec2';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { Stroke } from './stroke';

export class StrokeRectangle extends Stroke {
    secondaryColor: string;
    topLeftCorner: Vec2;
    width: number;
    height: number;
    shapeType: TypeStyle;

    constructor(
        boundingPoints: Vec2[],
        color: string,
        strokeWidth: number,
        secondaryColor: string,
        topLeftCorner: Vec2,
        width: number,
        height: number,
        shapeType: TypeStyle,
    ) {
        super('rectangle', boundingPoints, color, strokeWidth);
        this.secondaryColor = secondaryColor;
        this.topLeftCorner = topLeftCorner;
        this.width = width;
        this.height = height;
        this.shapeType = shapeType;
    }

    drawStroke(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();
        ctx.rect(this.topLeftCorner.x, this.topLeftCorner.y, this.width, this.height);
        if (this.shapeType === TypeStyle.Stroke) {
           ctx.strokeStyle = this.secondaryColor;
           ctx.fillStyle = 'rgba(255, 0, 0, 0)';
        } else if (this.shapeType === TypeStyle.Fill) {
           ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
           ctx.fillStyle = this.primaryColor;
        } else {
           ctx.strokeStyle = this.secondaryColor;
           ctx.fillStyle = this.primaryColor;
        }
        ctx.fill();
        ctx.stroke();
    }

    prepForSelection(): void {
        this.topLeftCorner = {x: 0, y: 0};
    }

    prepForBaseCanvas(selectionTopLeftCorner: Vec2, selectionSize: Vec2): void {
        this.topLeftCorner = selectionTopLeftCorner;
        const bottomRightCorner = { x: selectionTopLeftCorner.x + selectionSize.x, y: selectionTopLeftCorner.y + selectionSize.y };
        this.boundingPoints = [selectionTopLeftCorner, bottomRightCorner];
    }
}
