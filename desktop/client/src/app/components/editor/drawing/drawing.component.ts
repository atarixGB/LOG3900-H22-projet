import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, OnChanges, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Vec2 } from '@app/classes/vec2';
import { MIN_SIZE } from '@app/constants/constants';
import { AutoSaveService } from '@app/services/editor/auto-save/auto-save.service';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { ExportService } from '@app/services/editor/export-image/export.service';
import { KeyHandlerService } from '@app/services/editor/key-handler/key-handler.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { CollabSelectionService } from '@app/services/editor/tools/selection/collab-selection.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';
import { DrawingData } from '@common/communication/drawing-data';
import { Subscription } from 'rxjs';

const WORKING_AREA_WIDTH = '85vw';
const WORKING_AREA_LENGHT = '100vh';
const LOAD_IMAGE = 100;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnDestroy, OnChanges {
    @ViewChild('baseCanvas', { static: false }) private baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) private previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorCanvas', { static: false }) private cursorCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('workingArea', { static: false }) private workingArea: ElementRef<HTMLDivElement>;
    @ViewChild('canvasContainer', { static: false }) private canvasContainer: ElementRef<HTMLDivElement>;
    @ViewChildren('selectionCP', { read: ElementRef }) private selectionCPs: QueryList<ElementRef<HTMLElement>>;


    dragPosition: Vec2;
    canvasSize: Vec2;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private cursorCtx: CanvasRenderingContext2D;
    private currentDrawing: ImageData;
    private subscription: Subscription;
    private positionX: number;
    private positionY: number;
    private drawing: DrawingData;

    constructor(
        public toolManagerService: ToolManagerService,
        public exportService: ExportService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private drawingService: DrawingService,
        private autoSaveService: AutoSaveService,
        private keyHandlerService: KeyHandlerService,
        private selectionService: SelectionService,
        private collabSelectionService: CollabSelectionService,
    ) {
        this.dragPosition = { x: 0, y: 0 };
        this.canvasSize = { x: MIN_SIZE, y: MIN_SIZE };
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.workingArea.nativeElement.style.width = WORKING_AREA_WIDTH;
        this.workingArea.nativeElement.style.height = WORKING_AREA_LENGHT;

        this.initialiseParameters();

        if (!this.autoSaveService.localStorageIsEmpty()) {
            window.onload = () => {
                this.autoSaveService.loadImage();
                this.canvasSize.x = this.autoSaveService.localDrawing.width;
                this.canvasSize.y = this.autoSaveService.localDrawing.height;
            };
        }

        this.route.params.subscribe((params) => {
            if (params.url) {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = () => {
                    this.canvasSize.x = img.width;
                    this.canvasSize.y = img.height;
                    // needed for drawImage to load correctly
                    setTimeout(() => this.baseCtx.drawImage(img, 0, 0), LOAD_IMAGE);
                    this.drawing = {
                        title: '',
                        width: this.drawingService.canvas.width,
                        height: this.drawingService.canvas.height,
                        body: this.drawingService.canvas.toDataURL(),
                    };
                    this.autoSaveService.saveCanvasState(this.drawing);
                };
                img.src = params.url;
            }
        });

        this.whiteBackgroundCanvas();
    }

    ngOnChanges(): void {
        this.route.params.subscribe((params) => {
            if (params.height && params.width) {
                this.canvasSize.x = params.width;
                this.canvasSize.y = params.height;
            }
        });
    }

    mouseCoord(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    onMouseMove(event: MouseEvent): void {
        this.cursorCtx.clearRect(0, 0, this.cursorCanvas.nativeElement.width, this.cursorCanvas.nativeElement.height);
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
        this.drawing = {
            title: '',
            width: this.drawingService.canvas.width,
            height: this.drawingService.canvas.height,
            body: this.drawingService.canvas.toDataURL(),
        };
        this.autoSaveService.saveCanvasState(this.drawing);
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

    dragMoved(event: CdkDragMove, resizeX: boolean, resizeY: boolean): void {
        this.previewCanvas.nativeElement.style.borderStyle = 'dotted';
        this.positionX = event.pointerPosition.x - this.baseCanvas.nativeElement.getBoundingClientRect().left;
        this.positionY = event.pointerPosition.y;

        this.currentDrawing = this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y);

        if (resizeX && this.positionX > MIN_SIZE) {
            this.previewCanvas.nativeElement.width = this.positionX;
        }

        if (resizeY && this.positionY > MIN_SIZE) {
            this.previewCanvas.nativeElement.height = this.positionY;
        }
    }

    dragEnded(event: CdkDragEnd): void {
        const newWidth: number = this.canvasSize.x + event.distance.x;
        const newHeight: number = this.canvasSize.y + event.distance.y;

        this.previewCanvas.nativeElement.style.borderStyle = 'solid';

        if (newWidth >= MIN_SIZE) {
            this.canvasSize.x = newWidth;
        } else {
            this.canvasSize.x = MIN_SIZE;
        }

        if (newHeight >= MIN_SIZE) {
            this.canvasSize.y = newHeight;
        } else {
            this.canvasSize.y = MIN_SIZE;
        }

        setTimeout(() => {
            this.whiteBackgroundCanvas();
            this.baseCtx.putImageData(this.currentDrawing, 0, 0);
            this.drawing = {
                title: '',
                width: this.drawingService.canvas.width,
                height: this.drawingService.canvas.height,
                body: this.drawingService.canvas.toDataURL(),
            };
            this.autoSaveService.saveCanvasState(this.drawing);
        }, 0);
    }

    changePosition(): void {
        this.dragPosition = { x: this.dragPosition.x, y: this.dragPosition.y };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    async getNewImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (err: string | Event) => {
                reject(err);
            };
            img.src = src;
        });
    }

    private initialiseParameters(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.cursorCtx = this.cursorCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.cursorCtx = this.cursorCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.keyHandlerService.baseCtx = this.baseCtx;
        this.keyHandlerService.canvasSize = this.canvasSize;
        this.adjustCanvasSize();

        this.selectionService.containerDiv = this.canvasContainer.nativeElement;
        this.collabSelectionService.containerDiv = this.canvasContainer.nativeElement;
        const cpRefArray = this.selectionCPs.toArray();
        for (let i = 0; i < cpRefArray.length; i++) {
            this.selectionService.selectionCPs[i] = cpRefArray[i].nativeElement;
        }
    }

    private adjustCanvasSize(): void {
        this.canvasSize = { x: this.workingArea.nativeElement.offsetWidth / 2, y: this.workingArea.nativeElement.offsetHeight / 2 };
        if (this.canvasSize.x < MIN_SIZE || this.canvasSize.y < MIN_SIZE) {
            this.canvasSize = { x: MIN_SIZE, y: MIN_SIZE };
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
