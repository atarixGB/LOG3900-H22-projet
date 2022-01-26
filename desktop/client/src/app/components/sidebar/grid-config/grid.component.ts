import { Component, HostListener } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/selection/magnetism.service';
import { TextService } from '@app/services/tools/text/text.service';

const MIN_GRID_SQUARE_SIZE = 5;
const MAX_GRID_SQUARE_SIZE = 200;
const MIN_GRID_OPACITY = 10;
const MAX_GRID_OPACITY = 100;
const DEFAULT_GRID_SIZE = 5;
const DEFAULT_GRID_OPACITY = 10;
const SQUARE_STEP = 5;
const TWO_DECIMAL_MULTIPLIER = 100;
@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    isEnabled: boolean;
    minSquareSize: number;
    maxSquareSize: number;
    minOpacity: number;
    maxOpacity: number;
    squareSize: number;
    currentOpacity: number;

    constructor(public drawingService: DrawingService, public magnetismService: MagnetismService, public textService: TextService) {
        this.isEnabled = false;
        this.minSquareSize = MIN_GRID_SQUARE_SIZE;
        this.maxSquareSize = MAX_GRID_SQUARE_SIZE;
        this.minOpacity = MIN_GRID_OPACITY;
        this.maxOpacity = MAX_GRID_OPACITY;
        this.squareSize = DEFAULT_GRID_SIZE;
        this.currentOpacity = DEFAULT_GRID_OPACITY;
        this.drawingService.gridSpaces = this.squareSize;
        this.magnetismService.setGridSpaces(this.squareSize);
        this.drawingService.gridOpacity = this.currentOpacity;
    }

    switchGridView(isEnabled: boolean): void {
        this.isEnabled = isEnabled;
        this.drawingService.isGridEnabled = isEnabled;
        if (isEnabled) this.drawingService.setGrid();
        else this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }

    changeGridSize(newSize: number): void {
        newSize = Number(newSize);
        this.drawingService.gridSpaces = newSize;
        this.squareSize = newSize;
        this.magnetismService.setGridSpaces(this.squareSize);
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }

    changeOpacity(newOpacity: number): void {
        newOpacity = Number(newOpacity);
        newOpacity = Math.round((newOpacity + Number.EPSILON) * TWO_DECIMAL_MULTIPLIER) / TWO_DECIMAL_MULTIPLIER;
        this.drawingService.gridOpacity = newOpacity;
        this.currentOpacity = newOpacity;
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }

    @HostListener('window:keydown.g')
    gIsClicked(): void {
        if (!this.textService.isWriting) {
            this.isEnabled = !this.isEnabled;
            this.drawingService.isGridEnabled = this.isEnabled;
            if (this.isEnabled) this.drawingService.setGrid();
            else this.drawingService.clearCanvas(this.drawingService.gridCtx);
        }
    }

    @HostListener('window:keydown.=')
    @HostListener('window:keydown.shift.+')
    increase(): void {
        if (this.squareSize < MAX_GRID_SQUARE_SIZE) {
            this.squareSize += SQUARE_STEP;
            this.drawingService.gridSpaces = this.squareSize;
            this.magnetismService.setGridSpaces(this.squareSize);
            if (this.isEnabled) this.drawingService.setGrid();
        }
    }
    @HostListener('window:keydown.-')
    decrease(): void {
        if (this.squareSize > MIN_GRID_SQUARE_SIZE) {
            this.squareSize -= SQUARE_STEP;
            this.drawingService.gridSpaces = this.squareSize;
            this.magnetismService.setGridSpaces(this.squareSize);
            if (this.isEnabled) this.drawingService.setGrid();
        }
    }
}
