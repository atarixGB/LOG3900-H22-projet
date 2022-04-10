import { Component, OnInit } from '@angular/core';
import { DrawingService } from '@app/services/editor/drawing/drawing.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';

@Component({
  selector: 'app-draft-dialog',
  templateUrl: './draft-dialog.component.html',
  styleUrls: ['./draft-dialog.component.scss']
})
export class DraftDialogComponent implements OnInit {

  constructor(public drawingService: DrawingService, public selectionService: SelectionService) { }

  ngOnInit(): void {
  }

  enterDraftMode(): void {
    this.drawingService.setCurrentDrawingBlanc();
    this.selectionService.strokes = [];
  }
}
