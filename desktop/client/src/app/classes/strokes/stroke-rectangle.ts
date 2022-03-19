import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { Stroke } from './stroke';

export class StrokeRectangle extends Stroke {
    secondaryColor: string;
    topLeftCorner: Vec2;
    width: number;
    height: number;
    isSecondColorTransparent: boolean;

    constructor(
        boundingPoints: Vec2[],
        color: string,
        strokeWidth: number,
        secondaryColor: string,
        topLeftCorner: Vec2,
        width: number,
        height: number,
    ) {
        super(ToolList.Rectangle, boundingPoints, color, strokeWidth);
        this.secondaryColor = secondaryColor;
        this.topLeftCorner = topLeftCorner;
        this.width = width;
        this.height = height;
    }

    drawStroke(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();
        ctx.rect(this.topLeftCorner.x, this.topLeftCorner.y, this.width, this.height);
        ctx.fillStyle = this.secondaryColor;
        ctx.strokeStyle = this.primaryColor;
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

    rescale(scale: Vec2): void {
        this.width = this.width * scale.x;
        this.height = this.height * scale.y;
    }

    updateStrokeColors(newPrimary: string, newSecondary: string): void {
        this.primaryColor = newPrimary;
        this.secondaryColor = newSecondary;
    }
}
