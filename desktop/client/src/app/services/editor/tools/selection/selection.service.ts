import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  zIndex: number;

  isActiveSelection: boolean;
  isMoving: boolean;

  shouldBeSelectionTool: Subject<boolean>;
  toolUpdate$: Observable<boolean>;

  constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService) {
    super(drawingService);
    this.strokes = [];
    this.shouldBeSelectionTool = new Subject();
    this.toolUpdate$ = this.shouldBeSelectionTool.asObservable();
    this.zIndex = 10; //Arbitrary value to make sure user selection is put to front
    this.isActiveSelection = false;
    this.isMoving = false;
  }

  switchToSelectionTool(): void {
    this.shouldBeSelectionTool.next(true);
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
  }

  selectStroke(stroke: Stroke): void {
    this.isActiveSelection = true;
    this.selectedStroke = stroke;
    this.previewSelection(stroke);
    this.redrawAllStrokesExceptSelected(stroke);
  }

  onMouseClick(event: MouseEvent): void {
    if (!this.isActiveSelection && this.isStrokeFound(this.getPositionFromMouse(event))) {
      this.selectStroke(this.strokes[this.selectedIndex]);
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
          this.moveSelectionService.setSelectionCnv(this.selectionCnv, this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
      } else {
        this.pasteSelectionOnBaseCnv();
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

  updateSelectionStrokeWidth(newWidth: number): void {
    this.selectedStroke.updateStrokeWidth(newWidth);
    this.drawingService.clearCanvas(this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.selectedStroke.drawStroke(this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
  }

  pasteSelectionOnBaseCnv(): void {
    const selectionTopLeftCorner = { x: this.selectionCnv.offsetLeft, y: this.selectionCnv.offsetTop }
    const selectionSize = { x: this.selectionCnv.width, y: this.selectionCnv.height }
    this.selectedStroke.prepForBaseCanvas(selectionTopLeftCorner, selectionSize);
    this.selectedStroke.drawStroke(this.drawingService.baseCtx);
    this.addStroke(this.selectedStroke);
    this.deleteSelection();
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

  private isStrokeFound(clickedPos: Vec2): boolean {
    for (let i = this.strokes.length - 1; i >= 0; i--) {
      if (this.isInBounds(this.strokes[i].boundingPoints, clickedPos)) {
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

  private previewSelection(stroke: Stroke): void {
    this.selectionCnv = this.createSelectionCanvas(stroke, this.zIndex);
    this.positionSelectionCanvas(stroke, this.selectionCnv);
    this.pasteStrokeOnSelectionCnv(stroke, this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private createSelectionCanvas(stroke: Stroke, zIndex: number): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.id = 'selectionCnv';
    this.containerDiv.appendChild(canvas);
    canvas.style.position = 'relative';
    canvas.style.zIndex = zIndex.toString();
    canvas.width = stroke.boundingPoints[1].x - stroke.boundingPoints[0].x;
    canvas.height = stroke.boundingPoints[1].y - stroke.boundingPoints[0].y;
    canvas.style.border = '2px solid blue';
    return canvas;
  }

  private positionSelectionCanvas(stroke: Stroke, cnv: HTMLCanvasElement): void {
    cnv.style.top = stroke.boundingPoints[0].y.toString() + 'px';
    cnv.style.left = stroke.boundingPoints[0].x.toString() + 'px';
  }

  private pasteStrokeOnSelectionCnv(stroke: Stroke, selectionCtx: CanvasRenderingContext2D): void {
    stroke.prepForSelection();
    stroke.drawStroke(selectionCtx);
  }

  private redrawAllStrokesExceptSelected(stroke: Stroke): void {
    if (this.strokes.includes(stroke)) {
      this.strokes.splice(this.strokes.indexOf(stroke), 1);
    }

    this.drawingService.clearCanvas(this.drawingService.baseCtx);
    this.strokes.forEach(stroke => {
      stroke.drawStroke(this.drawingService.baseCtx);
    });
  }
}
