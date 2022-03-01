import { Vec2 } from '@app/classes/vec2';

export abstract class Stroke {
    sender: any;
    toolType: string;
    boundingPoints: Vec2[];
    primaryColor: string;
    strokeWidth: number;

    constructor(tool: string, boundingPoints: Vec2[], color: string, width: number) {
        this.boundingPoints = boundingPoints;
        this.toolType = tool;
        this.primaryColor = color;
        this.strokeWidth = width;
    }

    drawStroke(ctx: CanvasRenderingContext2D): void { }

    prepForSelection(): void {}

    prepForBaseCanvas(selectionTopLeftCorner: Vec2, selectionSize: Vec2): void {}

    updateStrokeWidth(newWidth: number): void {
        this.strokeWidth = newWidth;
    }
}
