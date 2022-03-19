import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { DrawingService } from '../../drawing/drawing.service';
import { SelectionService } from './selection.service';
 
@Injectable({
  providedIn: 'root' 
})
export class CollabSelectionService {
  selectionCnvs: Map<string, HTMLCanvasElement>;
  containerDiv: HTMLElement;
  zIndex: number;
  borderColor: string;

  constructor(private drawingService: DrawingService, private selectionService: SelectionService,  private collaborationService: CollaborationService) {
    this.selectionCnvs = new Map<string, HTMLCanvasElement>();
    this.zIndex = 0;
    this.borderColor = 'lightblue';
    this.setSubscriptions();
  }
  
  addSelectedStroke(selected: any): void {
    this.selectionService.strokesSelected.push(this.selectionService.strokes[selected.strokeIndex]);
    this.displaySelection(selected.sender, selected.strokeIndex);
  }
  
  private moveUpdate(sender: string, newPos: Vec2): void {
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    this.selectionService.positionSelectionCanvas(newPos, cnv);
  }

  private resizeUpdate(sender: string, strokeIndex: number, newPos: Vec2, newDimensions: Vec2, scale: Vec2): void {
    let stroke = this.selectionService.strokes[strokeIndex];
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    this.selectionService.positionSelectionCanvas(newPos, cnv);
    cnv.width = newDimensions.x;
    cnv.height = newDimensions.y;
    stroke.rescale(scale);
    stroke.drawStroke(cnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private updateSelectionStrokeWidth(sender: string, strokeIndex: number, newWidth: number): void {
    let stroke = this.selectionService.strokes[strokeIndex];
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    stroke.updateStrokeWidth(newWidth);
    this.drawingService.clearCanvas(cnv.getContext('2d') as CanvasRenderingContext2D);
    stroke.drawStroke(cnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private updateSelectionStrokeColors(sender: string, strokeIndex: number, newPrimary: string, newSecondary: string): void {
    let stroke = this.selectionService.strokes[strokeIndex];
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    stroke.updateStrokeColors(newPrimary, newSecondary);
    this.drawingService.clearCanvas(cnv.getContext('2d') as CanvasRenderingContext2D);
    stroke.drawStroke(cnv.getContext('2d') as CanvasRenderingContext2D);
  }

  private pasteSelected(sender: string, strokeIndex: number): void {
    let stroke = this.selectionService.strokes[strokeIndex];
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    const selectionTopLeftCorner = { x: cnv.offsetLeft, y: cnv.offsetTop }
    const selectionSize = { x: cnv.width, y: cnv.height }
    stroke.prepForBaseCanvas(selectionTopLeftCorner, selectionSize);
    this.selectionService.strokesSelected.splice(this.selectionService.strokesSelected.indexOf(stroke), 1);
    this.selectionService.redrawAllStrokesExceptSelected();
    this.selectionService.deleteSelection(cnv);
    this.selectionCnvs.delete(sender);
  }

  private removeSelected(sender: string, strokeIndex: number): void {
    let stroke = this.selectionService.strokes[strokeIndex];
    let cnv = this.selectionCnvs.get(sender) as HTMLCanvasElement;
    this.selectionService.deleteSelection(cnv);
    this.selectionCnvs.delete(sender);
    this.selectionService.strokes.splice(strokeIndex, 1);
    this.selectionService.strokesSelected.splice(this.selectionService.strokesSelected.indexOf(stroke), 1);
    if (strokeIndex < this.selectionService.selectedIndex) {
      this.selectionService.selectedIndex--;
    }
  }

  private displaySelection(sender: string, strokeIndex: number) {
    let stroke = this.selectionService.strokes[strokeIndex];
    let selectionCnv = this.selectionService.createSelectionCanvas(this.containerDiv, stroke, ((++this.zIndex) % 4) + 5, this.borderColor, 'collabSelectionCnv');
    this.selectionCnvs.set(sender, selectionCnv);
    const pos = {x: stroke.boundingPoints[0].x, y: stroke.boundingPoints[0].y }
    this.selectionService.positionSelectionCanvas(pos, selectionCnv);
    this.selectionService.pasteStrokeOnSelectionCnv(stroke, selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.selectionService.redrawAllStrokesExceptSelected();
  } 

  private setSubscriptions(): void {
    this.collaborationService.newSelection$.subscribe((newSelection: any) => {
      this.addSelectedStroke(newSelection);
    });

    this.collaborationService.newSelectionPos$.subscribe((newSelectionPos: any) => {
      this.moveUpdate(newSelectionPos.sender, newSelectionPos.pos);
    });

    this.collaborationService.newSelectionSize$.subscribe((newSelectionSize: any) => {
      this.resizeUpdate(newSelectionSize.sender, newSelectionSize.strokeIndex, newSelectionSize.newPos, newSelectionSize.newDimensions, newSelectionSize.scale);
    });

    this.collaborationService.pasteRequest$.subscribe((pasteReq: any) => {
      this.pasteSelected(pasteReq.sender, pasteReq.strokeIndex);
    });

    this.collaborationService.deleteRequest$.subscribe((delReq: any) => {
      this.removeSelected(delReq.sender, delReq.strokeIndex);
    });

    this.collaborationService.newStrokeWidth$.subscribe((width: any) => {
      this.updateSelectionStrokeWidth(width.sender, width.strokeIndex, width.value);
    });

    this.collaborationService.newStrokeColors$.subscribe((colors: any) => {
      this.updateSelectionStrokeColors(colors.sender, colors.strokeIndex, colors.primeColor, colors.secondColor);
    });
  }
}
