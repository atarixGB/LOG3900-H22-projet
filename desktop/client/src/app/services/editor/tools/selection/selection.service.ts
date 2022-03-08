import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class SelectionService extends Tool {
  constructor(drawingService: DrawingService) {
    super(drawingService);
  }
}
