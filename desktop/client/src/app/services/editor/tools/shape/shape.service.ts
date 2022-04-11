import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_LINE_THICKNESS, MouseButton } from '@app/constants/constants';
import { ColorManagerService } from '@app/services/editor/color-manager/color-manager.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';
export abstract class ShapeService extends Tool {
    pathData: Vec2[];
    lineWidth: number;
    isSelection: boolean;
    isShiftShape: boolean;
    colorPrime: string;
    colorSecond: string;
    selectedWidth: number;

    protected fillValue: boolean;
    protected strokeValue: boolean;
    protected size: Vec2;
    protected origin: Vec2;

    constructor(drawingService: DrawingService, protected colorManager: ColorManagerService, protected soundEffectsService: SoundEffectsService) {
        super(drawingService);
        this.lineWidth = DEFAULT_LINE_THICKNESS;
        this.selectedWidth = 1;
        this.fillValue = false;
        this.strokeValue = false;
        this.isSelection = false;
        this.clearPath();
        this.isShiftShape = false;
        this.size = { x: 0, y: 0 };
    }

    abstract onMouseUp(event: MouseEvent): void;
    abstract onMouseMove(event: MouseEvent): void;
    abstract drawShape(ctx: CanvasRenderingContext2D, isAnotherShapeBorder?: boolean): void;
    abstract lowerLeft(path: Vec2[]): void;
    abstract upperLeft(path: Vec2[]): void;
    abstract upperRight(path: Vec2[]): void;
    abstract lowerRight(path: Vec2[]): void;

    clearPath(): void {
        this.pathData = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.soundEffectsService.startDrawSound();
        }
        this.colorPrime = this.colorManager.primaryColor;
        this.colorSecond = this.colorManager.secondaryColor;
    }

    protected findMouseDirection(): void {
        const width = this.pathData[this.pathData.length - 1].x - this.pathData[0].x;
        const height = this.pathData[this.pathData.length - 1].y - this.pathData[0].y;
        if (width <= 0 && height >= 0) {
            this.lowerLeft(this.pathData);
        } else if (height <= 0 && width >= 0) {
            this.upperRight(this.pathData);
        } else if (height <= 0 && width <= 0) {
            this.upperLeft(this.pathData);
        } else {
            this.lowerRight(this.pathData);
        }
    }

    protected computeSize(): void {
        if (this.pathData.length > 0) {
            this.size.x = this.pathData[this.pathData.length - 1].x - this.pathData[0].x;
            this.size.y = this.pathData[this.pathData.length - 1].y - this.pathData[0].y;
            this.size.x = Math.abs(this.size.x);
            this.size.y = Math.abs(this.size.y);
        } else {
            throw new Error('No data in path');
        }
    }

    protected findLeftPoint(startPoint: Vec2, endPoint: Vec2): Vec2 {
        let x = startPoint.x;
        let y = startPoint.y;

        if (startPoint.x >= endPoint.x && startPoint.y >= endPoint.y) {
            x = endPoint.x;
            y = endPoint.y;
        } else if (startPoint.x > endPoint.x && startPoint.y < endPoint.y) {
            x = endPoint.x;
            y = startPoint.y;
        } else if (startPoint.x < endPoint.x && startPoint.y > endPoint.y) {
            x = startPoint.x;
            y = endPoint.y;
        }
        return { x, y };
    }
}
