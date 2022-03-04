import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { ICollabSelection } from '@app/interfaces-enums/ICollabSelection';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { SelectionService } from './selection.service';
 
@Injectable({
  providedIn: 'root' 
})
export class CollabSelectionService {
  selectionStrokes: Map<string, Stroke>;
  selectionCnvs: Map<string, HTMLCanvasElement>;

  containerDiv: HTMLElement;
  zIndex: number;

  constructor(private selectionService: SelectionService,  private collaborationService: CollaborationService) {
    this.selectionStrokes = new Map<string, Stroke>();
    this.selectionCnvs = new Map<string, HTMLCanvasElement>();
    this.zIndex = 0;

    this.collaborationService.newSelection$.subscribe((newSelection: any) => {
      console.log('Selection received in collab Selection service'); 
      this.addSelectedStroke(newSelection as ICollabSelection);
    });
  }

  addSelectedStroke(selected: ICollabSelection): void {
    this.selectionStrokes.set(selected.selectorID, this.selectionService.strokes[selected.strokeIndex]);
    this.displaySelection(selected);
  }
  
  /*moveUpdate(): void {
  
  }

  resizeUpdate(): void {
  
  }

  strokeModificationUpdate(): void {

  }

  pasteSelected(): void {

  }*/

  private displaySelection(selected: ICollabSelection) {
    let stroke = this.selectionStrokes.get(selected.selectorID) as Stroke;
    let selectionCnv = this.selectionService.createSelectionCanvas(this.containerDiv, stroke, ((++this.zIndex) % 4) + 5, 'pink');
    this.selectionCnvs.set(selected.selectorID, selectionCnv);
    const pos = {x: stroke.boundingPoints[0].x, y: stroke.boundingPoints[0].y }
    this.selectionService.positionSelectionCanvas(pos, selectionCnv);
    this.selectionService.pasteStrokeOnSelectionCnv(stroke, selectionCnv.getContext('2d') as CanvasRenderingContext2D);
    this.selectionService.redrawAllStrokesExceptSelected(stroke);
  } 
}
