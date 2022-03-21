import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Stroke } from '@app/classes/strokes/stroke';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/constants';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { MoveSelectionService } from './move-selection.service';
import { ResizeSelectionService } from '@app/services/editor/tools/selection/resize-selection.service'
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { StrokeRectangle } from '@app/classes/strokes/stroke-rectangle';
import { StrokeEllipse } from '@app/classes/strokes/stroke-ellipse';
import { StrokePencil } from '@app/classes/strokes/stroke-pencil';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { SoundEffectsService } from '@app/services/sound-effects/sound-effects.service';

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
  selectionCPs: HTMLElement[];
  isActiveSelection: boolean;
  isMoving: boolean;
  isResizing: boolean;
  dimensionsBeforeResize: Vec2;
  toolUpdate: Subject<number>;
  toolUpdate$: Observable<number>;
  callMouseDown: Subject<MouseEvent>;
  callMouseDown$: Observable<MouseEvent>;
  oldTool: number;

  constructor(drawingService: DrawingService, private moveSelectionService: MoveSelectionService, private collaborationService: CollaborationService, private resizeSelectionService: ResizeSelectionService, private soundEffectsService: SoundEffectsService) {
    super(drawingService);
    this.strokes = []; 
    this.toolUpdate = new Subject();
    this.toolUpdate$ = this.toolUpdate.asObservable();
    this.callMouseDown = new Subject();
    this.callMouseDown$ = this.callMouseDown.asObservable();
    this.zIndex = 10; //Arbitrary value to make sure user selection is put to front
    this.borderColor = 'blue';
    this.selectionCPs = [];
    this.isActiveSelection = false; 
    this.isMoving = false;
    this.isResizing = false;

    this.collaborationService.newStroke$.subscribe((newStroke: any) => {
      this.addIncomingStrokeFromOtherUser(newStroke);
    });
  }

  switchToSelectionTool(oldTool: number): void {
    this.oldTool = oldTool;
    this.toolUpdate.next(ToolList.Selection);
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
      sender: '',
      strokeIndex: index,
    });
  }

  onMouseClick(event: MouseEvent): void {
    if (!this.isActiveSelection && this.isStrokeFound(this.getPositionFromMouse(event))) {
      this.selectStroke(this.strokes[this.selectedIndex]);
      this.soundEffectsService.playSelectionSound();
    } 
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === MouseButton.Left && this.isActiveSelection) {
      const mouseTarget = event.target as HTMLElement;
      if (this.isOnSelectionCanvas(mouseTarget)) {
          this.isMoving = true;
          this.moveSelectionService.setSelectionCnv(this.selectionCnv, this.selectionCnv.getContext('2d') as CanvasRenderingContext2D, this.selectionCPs);
          this.moveSelectionService.onMouseDown(event);
      } else if (this.isOnResizeCp(mouseTarget)) {
          this.isResizing = true;
          this.dimensionsBeforeResize = { x: this.selectionCnv.width, y: this.selectionCnv.height}
          this.resizeSelectionService.setSelectionCnv(this.selectionCnv, this.selectionCnv.getContext('2d') as CanvasRenderingContext2D, this.selectionCPs, this.selectedStroke);
          this.resizeSelectionService.onMouseDown(event);
      } else {
          this.pasteSelectionOnBaseCnv();
          this.callMouseDown.next(event);
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isActiveSelection) {
      if (this.isMoving) {
        this.moveSelectionService.onMouseMove(event);
        this.adjustCpsToSelection();
      } else if (this.isResizing) {
        this.resizeSelectionService.onMouseMove(event);
        this.adjustCpsToSelection();
      } 
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.isMoving) {
      this.isMoving = false;
      this.collaborationService.broadcastSelectionPos({
        sender: '',
        pos: { x: this.selectionCnv.offsetLeft, y: this.selectionCnv.offsetTop },
      });
    } else if(this.isResizing) {
      this.isResizing = false;
      const currentDimensions = {x: this.selectionCnv.width, y: this.selectionCnv.height};
      const scale = {x: currentDimensions.x / this.dimensionsBeforeResize.x, y: currentDimensions.y / this.dimensionsBeforeResize.y}
      this.collaborationService.broadcastSelectionSize({
        sender: '',
        newPos: { x: this.selectionCnv.offsetLeft, y: this.selectionCnv.offsetTop },
        newDimensions: currentDimensions,
        scale: scale,
      });
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (this.isActiveSelection) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.deleteSelection(this.selectionCnv);
        this.hideSelectionCps();
        this.collaborationService.broadcastDeleteRequest();
        this.isActiveSelection = false;
      } else if (event.key === 'Enter') {
        this.pasteSelectionOnBaseCnv();
        this.toolUpdate.next(this.oldTool);
      }
    }
  }

  updateSelectionStrokeWidth(newWidth: number): void {
    this.selectedStroke.updateStrokeWidth(newWidth);
    this.drawingService.clearCanvas(this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.selectedStroke.drawStroke(this.selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.collaborationService.broadcastNewStrokeWidth({
      sender: '',
      value: newWidth,
    });
  }

  pasteSelectionOnBaseCnv(): void {
    const selectionTopLeftCorner = { x: this.selectionCnv.offsetLeft, y: this.selectionCnv.offsetTop }
    const selectionSize = { x: this.selectionCnv.width, y: this.selectionCnv.height }
    this.selectedStroke.prepForBaseCanvas(selectionTopLeftCorner, selectionSize);
    this.selectedStroke.drawStroke(this.drawingService.baseCtx);
    this.addStroke(this.selectedStroke);
    this.deleteSelection(this.selectionCnv);
    this.hideSelectionCps();
    this.isActiveSelection = false;
    this.collaborationService.broadcastPasteRequest();
  }

  deleteSelection(selection: HTMLCanvasElement): void {
    if (selection) {
      selection.remove();
      this.toolUpdate.next(this.oldTool);
    }
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

  private isOnSelectionCanvas(mouseLocation: HTMLElement): boolean {
    return mouseLocation.id === 'selectionCnv';
  }

  private isOnResizeCp(mouseLocation: HTMLElement): boolean {
    return mouseLocation.id === 'selectionCP';
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
    this.adjustCpsToSelection();
  }

  private adjustCpsToSelection(): void {
    const cpRadius = this.selectionCPs[0].offsetWidth / 2;
    const topLeftCpPos = { x: this.selectionCnv.offsetLeft - cpRadius, y: this.selectionCnv.offsetTop - cpRadius };
    const cnvWidth = this.selectionCnv.offsetWidth;
    const cnvHeight = this.selectionCnv.offsetHeight;

    this.selectionCPs.forEach(cp => {
      cp.style.zIndex = (this.zIndex + 1).toString();
      cp.style.visibility = 'visible';
    });

    this.positionCp(this.selectionCPs[0], topLeftCpPos);
    this.positionCp(this.selectionCPs[1], {x: topLeftCpPos.x + cnvWidth, y: topLeftCpPos.y });
    this.positionCp(this.selectionCPs[2], {x: topLeftCpPos.x, y: topLeftCpPos.y + cnvHeight});
    this.positionCp(this.selectionCPs[3], {x: topLeftCpPos.x + cnvWidth, y: topLeftCpPos.y + cnvHeight});
  }

  private positionCp(cp: HTMLElement, pos: Vec2): void {
    cp.style.left = (pos.x).toString() + 'px';
    cp.style.top = (pos.y).toString() + 'px';
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

  private hideSelectionCps(): void {
    this.selectionCPs.forEach(cp => {
      cp.style.visibility = 'hidden';
    });
  }
}
