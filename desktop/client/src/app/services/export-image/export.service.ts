import { Injectable } from '@angular/core';
import { FiltersList } from '@app/interfaces-enums/filter-list';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';

const PREVIEW_ORIGIN_X = 0;
const PREVIEW_ORIGIN_Y = 0;
const PREVIEW_WIDTH = 400;
const PREVIEW_HEIGHT = 250;
const DEFAULT_INTENSITY = 50;

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    baseCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    resizeWidth: number;
    resizeHeight: number;
    drawingTitle: string;
    currentDrawing: string;
    imgurURL: string;
    currentImageFormat: string;
    filterIntensity: number;
    currentFilter: string | undefined;
    selectedFilter: FiltersList;

    private filtersBindings: Map<FiltersList, string>;
    private image: HTMLImageElement;

    constructor(private drawingService: DrawingService, private indexService: IndexService) {
        this.filtersBindings = new Map<FiltersList, string>();
        this.filtersBindings
            .set(FiltersList.None, 'none')
            .set(FiltersList.Blur, 'blur')
            .set(FiltersList.Brightness, 'brightness')
            .set(FiltersList.Contrast, 'contrast')
            .set(FiltersList.Invert, 'invert')
            .set(FiltersList.Grayscale, 'grayscale');

        this.drawingTitle = 'dessin';
        this.currentDrawing = '';
        this.currentImageFormat = 'png';
        this.selectedFilter = FiltersList.None;
        this.currentFilter = this.filtersBindings.get(this.selectedFilter);
        this.filterIntensity = DEFAULT_INTENSITY;

        this.image = new Image();

        this.imgurURL = '';
    }

    initializeExportParams(): void {
        this.drawingTitle = 'dessin';
        this.selectedFilter = FiltersList.None;
        this.currentFilter = 'none';
        this.currentImageFormat = 'png';
    }
    imagePrevisualization(): void {
        this.currentDrawing = this.drawingService.canvas.toDataURL();
        this.image.src = this.currentDrawing;
        this.getResizedCanvas();

        this.image.onload = () => {
            this.baseCtx.drawImage(this.image, PREVIEW_ORIGIN_X, PREVIEW_ORIGIN_Y, this.resizeWidth, this.resizeHeight);
        };
    }

    applyFilter(): void {
        this.getResizedCanvas();

        if (this.filtersBindings.has(this.selectedFilter)) {
            this.currentFilter = this.filtersBindings.get(this.selectedFilter);
            this.image.src = this.currentDrawing;

            this.image.onload = () => {
                this.baseCtx.clearRect(PREVIEW_ORIGIN_X, PREVIEW_ORIGIN_Y, PREVIEW_WIDTH, PREVIEW_HEIGHT);

                if (this.currentFilter === 'none') {
                    this.baseCtx.filter = 'none';
                } else if (this.currentFilter === 'blur') {
                    this.baseCtx.filter = this.currentFilter + '(' + this.filterIntensity + 'px)';
                } else {
                    this.baseCtx.filter = this.currentFilter + '(' + this.filterIntensity + '%)';
                }
                this.currentFilter = this.baseCtx.filter;
                this.baseCtx.drawImage(this.image, PREVIEW_ORIGIN_X, PREVIEW_ORIGIN_Y, this.resizeWidth, this.resizeHeight);
            };
        }
    }

    exportDrawing(): void {
        const tempCanva = this.prevToBaseCanvas();
        const link = document.createElement('a');
        this.image.src = tempCanva.canvas.toDataURL('image/' + this.currentImageFormat);
        link.download = this.drawingTitle + '.' + this.currentImageFormat;
        link.href = this.image.src;
        link.click();
    }

    async uploadToImgur(): Promise<void> {
        const tempCanva = this.prevToBaseCanvas();
        let url = tempCanva.canvas.toDataURL('image/' + this.currentImageFormat);
        url = url.replace('data:image/' + this.currentImageFormat + ';base64', '');
        await this.indexService.uploadToImgur(url).then((info) => (this.imgurURL = info));
    }

    private prevToBaseCanvas(): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = this.drawingService.canvas.width;
        canvas.height = this.drawingService.canvas.height;
        if (this.currentFilter) {
            canvasCtx.filter = this.currentFilter;
        }
        canvasCtx.drawImage(this.drawingService.canvas, 0, 0);
        return canvasCtx;
    }

    private getResizedCanvas(): void {
        const ratio: number = this.getCanvasRatio();
        this.resizeWidth = PREVIEW_WIDTH;
        this.resizeHeight = this.resizeWidth / ratio;

        if (this.resizeHeight > PREVIEW_HEIGHT) {
            this.resizeHeight = PREVIEW_HEIGHT;
            this.resizeWidth = this.resizeHeight * ratio;
        }
    }

    private getCanvasRatio(): number {
        const width = this.drawingService.baseCtx.canvas.width;
        const height = this.drawingService.baseCtx.canvas.height;
        return width / height;
    }
}
