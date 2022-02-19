import { MouseButton } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { Tool } from './tool';
import { Vec2 } from './vec2';

export abstract class ToolShape extends Tool {
    width: number = 0;
    height: number = 0;
    protected firstPoint: Vec2;
    protected finalPoint: Vec2;
    selectType: string;
    primaryColor: string;
    secondaryColor: string;

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
    }
    protected abstract initializePolygonVariables(): void;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.firstPoint = this.getPositionFromMouse(event);
            this.width = 0;
            this.height = 0;
        }
    }
    protected abstract drawPolygon(ctx: CanvasRenderingContext2D): void;
    protected abstract ctxPreviewPerimeter(ctx: CanvasRenderingContext2D): void;

    protected squarePoint(startPoint: Vec2, currentPoint: Vec2): Vec2 {
        const pointResult: Vec2 = currentPoint;
        const width = Math.abs(currentPoint.x - startPoint.x);
        const height = Math.abs(currentPoint.y - startPoint.y);

        if (width < height) {
            if (
                (currentPoint.x <= startPoint.x && currentPoint.y <= startPoint.y) ||
                (currentPoint.x >= startPoint.x && currentPoint.y <= startPoint.y)
            ) {
                pointResult.y -= width - height;
            } else {
                pointResult.y += width - height;
            }
        } else {
            if (
                (currentPoint.x <= startPoint.x && currentPoint.y <= startPoint.y) ||
                (currentPoint.x <= startPoint.x && currentPoint.y >= startPoint.y)
            ) {
                pointResult.x -= height - width;
            } else {
                pointResult.x += height - width;
            }
        }
        return pointResult;
    }

    protected getCircleCenter(firstPoint: Vec2, endPoint: Vec2): Vec2 {
        let y: number = Math.abs(endPoint.y - firstPoint.y) / 2;
        let x: number = Math.abs(firstPoint.x - endPoint.x) / 2;

        x = endPoint.x > firstPoint.x ? firstPoint.x + x : firstPoint.x - x;
        y = endPoint.y > firstPoint.y ? firstPoint.y + y : firstPoint.y - y;
        return { x, y };
    }
}
