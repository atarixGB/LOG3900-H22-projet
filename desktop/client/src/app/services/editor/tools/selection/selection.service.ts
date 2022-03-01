import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionService extends Tool {
  strokes: Stroke[];
  selectedStroke: Stroke;

  containerDiv: HTMLElement;
  selectionCnv: HTMLCanvasElement;
  selectionCtx: CanvasRenderingContext2D;

  constructor(drawingService: DrawingService) {
    super(drawingService);
    this.strokes = [];
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
  }

  onMouseClick(event: MouseEvent): void {
    if (this.setSelectedStroke(this.getPositionFromMouse(event))) {
      this.previewSelection();

    } else {
      console.log('no stroke in bounds');
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.deleteSelection();
    }
  }
  
  private deleteSelection(): void {
    if (this.selectionCnv) {
      this.selectionCnv.remove();
    }
  }

  private setSelectedStroke(clickedPos: Vec2): boolean {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.isInBounds(this.strokes[i].boundingPoints, clickedPos)) {
        this.selectedStroke = this.strokes[i];
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
}
