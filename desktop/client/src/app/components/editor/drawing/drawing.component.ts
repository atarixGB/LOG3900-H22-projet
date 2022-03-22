import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { CNV_HEIGTH, CNV_WIDTH } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { ExportService } from '@app/services/editor/export-image/export.service';
import { KeyHandlerService } from '@app/services/editor/key-handler/key-handler.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { CollabSelectionService } from '@app/services/editor/tools/selection/collab-selection.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) private baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) private previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasContainer', { static: false }) private canvasContainer: ElementRef<HTMLDivElement>;
    @ViewChildren('selectionCP', { read: ElementRef }) private selectionCPs: QueryList<ElementRef<HTMLElement>>;


    dragPosition: Vec2;
    canvasSize: Vec2; 
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    constructor(
        public toolManagerService: ToolManagerService,
        public exportService: ExportService,
        public dialog: MatDialog,
        private drawingService: DrawingService,
        private keyHandlerService: KeyHandlerService,
        private selectionService: SelectionService,
        private collabSelectionService: CollabSelectionService,
    ) {
        this.canvasSize = { x: CNV_WIDTH, y: CNV_HEIGTH };
    }

    ngAfterViewInit(): void {
        this.initialiseParameters();
        this.whiteBackgroundCanvas();
    }

    mouseCoord(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    onMouseMove(event: MouseEvent): void {
        this.handleSelectionTool(event);
    }

    onMouseDown(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;

        if (!ELEMENT.className.includes('box')) {
            this.toolManagerService.onMouseDown(event, this.mouseCoord(event));
        }
    }

    onMouseUp(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;
        if (!ELEMENT.className.includes('box')) {
            this.toolManagerService.onMouseUp(event, this.mouseCoord(event));
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.toolManagerService.onMouseLeave(event);
    }

    @HostListener('wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        event.preventDefault();
        this.toolManagerService.onWheel(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        const ELEMENT = event.target as HTMLElement;
        if (!ELEMENT.className.includes('box')) {
            this.toolManagerService.onMouseClick(event);
        }
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.toolManagerService.onMouseDoubleClick(event);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        this.keyHandlerService.handleKeyUp(event);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        this.keyHandlerService.handleKeyDown(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    private initialiseParameters(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.keyHandlerService.baseCtx = this.baseCtx;
        this.keyHandlerService.canvasSize = this.canvasSize;

        this.selectionService.containerDiv = this.canvasContainer.nativeElement;
        this.collabSelectionService.containerDiv = this.canvasContainer.nativeElement;
        const cpRefArray = this.selectionCPs.toArray();
        for (let i = 0; i < cpRefArray.length; i++) {
            this.selectionService.selectionCPs[i] = cpRefArray[i].nativeElement;
        }
    }

    private handleSelectionTool(event: MouseEvent): void {
        const element = event.target as HTMLElement;
        if (!element.className.includes('box')) {
            this.toolManagerService.onMouseMove(event, this.mouseCoord(event));
        }
    }

    private whiteBackgroundCanvas(): void {
        this.baseCtx.beginPath();
        this.baseCtx.fillStyle = '#FFFFFF';
        this.baseCtx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);
        this.baseCtx.closePath();
    }
}
