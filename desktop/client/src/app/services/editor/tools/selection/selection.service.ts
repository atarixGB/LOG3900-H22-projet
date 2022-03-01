import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionService extends Tool {
  strokes: Stroke[];
  selectedStroke: Stroke;
  selectedIndex: number;

  containerDiv: HTMLElement;
  selectionCnv: HTMLCanvasElement;
  selectionCtx: CanvasRenderingContext2D;

  isActiveSelection: boolean;
  isMoving: boolean;

  constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService) {
    super(drawingService);
    this.strokes = [];
    this.isActiveSelection = false;
    this.isMoving = false;
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
  }

  onMouseClick(event: MouseEvent): void {
    if (!this.isActiveSelection && this.setSelectedStroke(this.getPositionFromMouse(event))) {
      this.isActiveSelection = true;
      this.previewSelection();
      this.redrawAllStrokesExceptSelected();
    } else {
      console.log('no stroke in bounds');
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === MouseButton.Left && this.isActiveSelection) {
      const mouseTarget = event.target as HTMLElement;
      if (this.isOnSelectionCanvas(mouseTarget)) {
          this.isMoving = true;
          this.moveSelectionService.oldMousePos = { x: event.x, y: event.y };
          this.moveSelectionService.setSelectionCnv(this.selectionCnv, this.selectionCtx);
      } else {
        this.pasteSelection();
        this.deleteSelection();
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isActiveSelection && this.isMoving) {
      this.moveSelectionService.onMouseMove(event);
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.isMoving = false;
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.deleteSelection();
    }
  }

  private isOnSelectionCanvas(mouseLocation: HTMLElement): boolean {
    return mouseLocation.id === 'selectionCnv';
  }
  
  private deleteSelection(): void {
    if (this.selectionCnv) {
      this.selectionCnv.remove();
      this.isActiveSelection = false;
    }
  }

  private setSelectedStroke(clickedPos: Vec2): boolean {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.isInBounds(this.strokes[i].boundingPoints, clickedPos)) {
        this.selectedStroke = this.strokes[i];
        this.selectedIndex = i;
        return true;
      }
    }
    return false;
  }

  private isInBounds(bounds: Vec2[], pointToCheck: Vec2): boolean {
    const topLeftBound = bounds[0];
    const bottomRightBound = bounds[1];
    return (
      pointToCheck.x >= topLeftBound.x &&
      pointToCheck.x <= bottomRightBound.x &&
      pointToCheck.y >= topLeftBound.y &&
      pointToCheck.y <= bottomRightBound.y
    );
  }

  private previewSelection(): void {
    this.createSelectionCanvas();
    this.positionSelectionCanvas();
    this.pasteStrokeOnSelectionCnv();
  }

  private createSelectionCanvas(): void {
    const width = this.selectedStroke.boundingPoints[1].x - this.selectedStroke.boundingPoints[0].x;
    const height = this.selectedStroke.boundingPoints[1].y - this.selectedStroke.boundingPoints[0].y;
    this.selectionCnv = document.createElement('canvas');
    this.selectionCnv.id = 'selectionCnv';
    this.containerDiv.appendChild(this.selectionCnv);
    this.selectionCnv.style.position = 'relative';
    this.selectionCnv.style.zIndex = '10'; // Arbitrary value to send it to front
    this.selectionCnv.width = width;
    this.selectionCnv.height = height;
    this.selectionCtx = this.selectionCnv.getContext('2d') as CanvasRenderingContext2D;
    this.selectionCnv.style.border = '2px solid blue';
  }

  private positionSelectionCanvas(): void {
    this.selectionCnv.style.top = this.selectedStroke.boundingPoints[0].y.toString() + 'px';
    this.selectionCnv.style.left = this.selectedStroke.boundingPoints[0].x.toString() +   'px';
  }

  private pasteStrokeOnSelectionCnv(): void {
    this.selectedStroke.prepForSelection();
    this.selectedStroke.drawStroke(this.selectionCtx);
  }

  private redrawAllStrokesExceptSelected(): void {
    this.strokes.splice(this.selectedIndex, 1);
    
    this.drawingService.clearCanvas(this.drawingService.baseCtx);
    this.strokes.forEach(stroke => {
      stroke.drawStroke(this.drawingService.baseCtx);
    });
  }

  private pasteSelection(): void {
    const selectionTopLeftCorner = { x: this.selectionCnv.offsetLeft, y: this.selectionCnv.offsetTop }
    const selectionSize = { x: this.selectionCnv.width, y: this.selectionCnv.height }
    this.selectedStroke.prepForBaseCanvas(selectionTopLeftCorner, selectionSize);
    this.selectedStroke.drawStroke(this.drawingService.baseCtx);
    this.addStroke(this.selectedStroke);
  }
}
