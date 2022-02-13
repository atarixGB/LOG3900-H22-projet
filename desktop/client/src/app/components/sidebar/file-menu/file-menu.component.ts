import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { ExportService } from '@app/services/export-image/export.service';
import { IndexService } from '@app/services/index/index.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(
        public dialog: MatDialog,
        public indexService: IndexService,
        public exportService: ExportService,
        private selectionService: SelectionService,
    ) {}

    handleCreateDraw(): void {
        this.selectionService.terminateSelection();
        this.dialog.open(NewDrawModalComponent, {});
    }
    handleExportDrawing(): void {
        this.selectionService.terminateSelection();
        this.dialog.open(ExportModalComponent, {});
        this.exportService.imagePrevisualization();
        this.exportService.initializeExportParams();
    }

    handleSaveDrawing(): void {
        this.selectionService.terminateSelection();
        this.dialog.open(SaveDrawingModalComponent, {});
    }
}
