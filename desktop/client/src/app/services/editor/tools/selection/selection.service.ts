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

  constructor(drawingService: DrawingService) {
    super(drawingService);
    this.strokes = [];
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
  }

  onMouseClick(event: MouseEvent): void {
    if (this.setSelectedStroke(this.getPositionFromMouse(event))) {
      console.log('Stroke selected: ', this.selectedStroke);

    } else {
      console.log('no stroke in bounds');
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
}
