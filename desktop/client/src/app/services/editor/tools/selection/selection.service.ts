import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stroke } from '@app/classes/strokes/stroke';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { StrokeRectangle } from '@app/classes/strokes/stroke-rectangle';
import { StrokeEllipse } from '@app/classes/strokes/stroke-ellipse';
import { StrokePencil } from '@app/classes/strokes/stroke-pencil';
import { ToolList } from '@app/interfaces-enums/tool-list';

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
  borderColor: string;

  isActiveSelection: boolean;
  isMoving: boolean;

  shouldBeSelectionTool: Subject<boolean>;
  toolUpdate$: Observable<boolean>;

  constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService, private collaborationService: CollaborationService) {
    super(drawingService);
    this.strokes = []; 
    this.shouldBeSelectionTool = new Subject();
    this.toolUpdate$ = this.shouldBeSelectionTool.asObservable();
    this.zIndex = 10; //Arbitrary value to make sure user selection is put to front
    this.borderColor = 'blue';
    this.isActiveSelection = false; 
    this.isMoving = false;

    this.collaborationService.newStroke$.subscribe((newStroke: any) => {
      console.log('Stroke received in selection service');
      this.addIncomingStrokeFromOtherUser(newStroke);
    });
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
    let index = this.strokes.indexOf(stroke);
    this.redrawAllStrokesExceptSelected(stroke);
    this.collaborationService.broadcastSelection({
      selectorID: '',
      strokeIndex: index,
    });
  }

  onMouseClick(event: MouseEvent): void {
    if (!this.isActiveSelection && this.isStrokeFound(this.getPositionFromMouse(event))) {
      this.selectStroke(this.strokes[this.selectedIndex]);
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
      this.deleteSelection(this.selectionCnv);
      this.isActiveSelection = false;
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
    this.deleteSelection(this.selectionCnv);
    this.isActiveSelection = false;
  }

  private isOnSelectionCanvas(mouseLocation: HTMLElement): boolean {
    return mouseLocation.id === 'selectionCnv';
  }
  
  deleteSelection(selection: HTMLCanvasElement): void {
    if (selection) {
      selection.remove();
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
    this.selectionCnv = this.createSelectionCanvas(this.containerDiv, stroke, this.zIndex, this.borderColor);
    const pos = {x: stroke.boundingPoints[0].x, y: stroke.boundingPoints[0].y }
    this.positionSelectionCanvas(pos, this.selectionCnv);
    this.pasteStrokeOnSelectionCnv(stroke, this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
  }

  createSelectionCanvas(containerDiv: HTMLElement, stroke: Stroke, zIndex: number, borderColor: string): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.id = 'selectionCnv';
    containerDiv.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.zIndex = zIndex.toString();
    canvas.width = stroke.boundingPoints[1].x - stroke.boundingPoints[0].x;
    canvas.height = stroke.boundingPoints[1].y - stroke.boundingPoints[0].y;
    canvas.style.border = '2px solid ' + borderColor;
    return canvas;
  }

  positionSelectionCanvas(topLeftPos: Vec2, cnv: HTMLCanvasElement): void {
    cnv.style.left = topLeftPos.x.toString() + 'px';
    cnv.style.top = topLeftPos.y.toString() + 'px';
  }

  pasteStrokeOnSelectionCnv(stroke: Stroke, selectionCtx: CanvasRenderingContext2D): void {
    stroke.prepForSelection();
    stroke.drawStroke(selectionCtx);
  }

  redrawAllStrokesExceptSelected(stroke: Stroke): void {
    if (this.strokes.includes(stroke)) {
      this.strokes.splice(this.strokes.indexOf(stroke), 1);
    }

    this.drawingService.clearCanvas(this.drawingService.baseCtx);
    this.strokes.forEach(stroke => {
      stroke.drawStroke(this.drawingService.baseCtx);
    });
  }

  private addIncomingStrokeFromOtherUser(stroke: any) {
    switch (stroke.toolType) {
      case ToolList.Rectangle: {
          const strokeRect: Stroke = new StrokeRectangle(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.secondaryColor, stroke.topLeftCorner, stroke.width, stroke.height, stroke.shapeType);
          strokeRect.drawStroke(this.drawingService.baseCtx);
          this.addStroke(strokeRect);
          break;
      }
      case ToolList.Ellipse: {
          const strokeEllipse: Stroke = new StrokeEllipse(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.secondaryColor, stroke.center, stroke.radius, stroke.shapeType);
          strokeEllipse.drawStroke(this.drawingService.baseCtx);
          this.addStroke(strokeEllipse);
          break;
      }
      case ToolList.Pencil: {
          const strokePencil: Stroke = new StrokePencil(stroke.boundingPoints, stroke.primaryColor, stroke.strokeWidth, stroke.points, stroke.isPoint);
          strokePencil.drawStroke(this.drawingService.baseCtx);
          this.addStroke(strokePencil);
          break;
      }
    }
  }
}
