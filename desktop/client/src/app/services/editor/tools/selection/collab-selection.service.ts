import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { Vec2 } from '@app/classes/vec2';
import { ICollabSelection } from '@app/interfaces-enums/ICollabSelection';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '../../drawing/drawing.service';
import { SelectionService } from './selection.service';
 
@Injectable({
  providedIn: 'root' 
})
export class CollabSelectionService {
  selectionStrokes: Map<string, Stroke>;
  selectionCnvs: Map<string, HTMLCanvasElement>;
  containerDiv: HTMLElement;
  zIndex: number;
  borderColor: string;

  constructor(private drawingService: DrawingService, private selectionService: SelectionService,  private collaborationService: CollaborationService) {
    this.selectionStrokes = new Map<string, Stroke>();
    this.selectionCnvs = new Map<string, HTMLCanvasElement>();
    this.zIndex = 0;
    this.borderColor = 'yellow';
    this.setSubscriptions();
  }
  
  addSelectedStroke(selected: ICollabSelection): void {
    this.selectionStrokes.set(selected.sender, this.selectionService.strokes[selected.strokeIndex]);
    this.displaySelection(selected);
  }
  
  private moveUpdate(sender: string, newPos: Vec2): void {
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    this.selectionService.positionSelectionCanvas(newPos, cnv);
  }

  private resizeUpdate(sender: string, newPos: Vec2, newDimensions: Vec2, scale: Vec2): void {
    let stroke = this.selectionStrokes.get(sender) as Stroke;
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    this.selectionService.positionSelectionCanvas(newPos, cnv);
    cnv.width = newDimensions.x;
    cnv.height = newDimensions.y;
    stroke.rescale(scale);
    stroke.drawStroke(cnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private updateSelectionStrokeWidth(sender: string, newWidth: number): void {
    let stroke = this.selectionStrokes.get(sender) as Stroke;
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    stroke.updateStrokeWidth(newWidth);
    this.drawingService.clearCanvas(cnv.getContext('2d') as CanvasRenderingContext2D);
    stroke.drawStroke(cnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private pasteSelected(sender: string): void {
    let stroke = this.selectionStrokes.get(sender) as Stroke;
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    const selectionTopLeftCorner = { x: cnv.offsetLeft, y: cnv.offsetTop }
    const selectionSize = { x: cnv.width, y: cnv.height }
    stroke.prepForBaseCanvas(selectionTopLeftCorner, selectionSize);
    stroke.drawStroke(this.drawingService.baseCtx);
    this.selectionService.addStroke(stroke);
    this.removeSelected(sender);
  }

  private removeSelected(sender: string): void {
    this.selectionService.deleteSelection(this.selectionCnvs.get(sender) as HTMLCanvasElement);
    this.selectionCnvs.delete(sender);
    this.selectionStrokes.delete(sender);
  }

  private displaySelection(selected: ICollabSelection) {
    let stroke = this.selectionStrokes.get(selected.sender) as Stroke;
    let selectionCnv = this.selectionService.createSelectionCanvas(this.containerDiv, stroke, ((++this.zIndex) % 4) + 5, this.borderColor);
    this.selectionCnvs.set(selected.sender, selectionCnv);
    const pos = {x: stroke.boundingPoints[0].x, y: stroke.boundingPoints[0].y }
    this.selectionService.positionSelectionCanvas(pos, selectionCnv);
    this.selectionService.pasteStrokeOnSelectionCnv(stroke, selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.selectionService.redrawAllStrokesExceptSelected(stroke);
  } 

  private setSubscriptions(): void {
    this.collaborationService.newSelection$.subscribe((newSelection: any) => {
      this.addSelectedStroke(newSelection as ICollabSelection);
    });

    this.collaborationService.newSelectionPos$.subscribe((newSelectionPos: any) => {
      this.moveUpdate(newSelectionPos.sender, newSelectionPos.pos);
    });

    this.collaborationService.newSelectionSize$.subscribe((newSelectionSize: any) => {
      this.resizeUpdate(newSelectionSize.sender, newSelectionSize.newPos, newSelectionSize.newDimensions, newSelectionSize.scale);
    });

    this.collaborationService.pasteRequest$.subscribe((pasteReq: any) => {
      this.pasteSelected(pasteReq.sender);
    });

    this.collaborationService.deleteRequest$.subscribe((delReq: any) => {
      this.removeSelected(delReq.sender);
    });

    this.collaborationService.newStrokeWidth$.subscribe((width: any) => {
      this.updateSelectionStrokeWidth(width.sender, width.value);
    });
  }
}
