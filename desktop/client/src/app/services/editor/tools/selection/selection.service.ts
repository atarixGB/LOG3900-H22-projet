import { Injectable } from '@angular/core';
import { Stroke } from '@app/classes/strokes/stroke';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionService extends Tool {
  strokes: Stroke[];

  constructor(drawingService: DrawingService) {
    super(drawingService);
    this.strokes = [];
  }

  addStroke(stroke: Stroke): void {
    this.strokes.push(stroke);
  }
}
