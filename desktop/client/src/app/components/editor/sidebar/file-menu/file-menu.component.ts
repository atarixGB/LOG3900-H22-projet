import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExportModalComponent } from '@app/components/editor/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/editor/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/editor/save-drawing-modal/save-drawing-modal.component';
import { ExportService } from '@app/services/editor/export-image/export.service';
import { IndexService } from '@app/services/editor/index/index.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-file-menu',
    templateUrl: './file-menu.component.html',
    styleUrls: ['./file-menu.component.scss'],
})
export class FileMenuComponent {
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(public dialog: MatDialog, public indexService: IndexService, public exportService: ExportService) {}

    handleCreateDraw(): void {
        this.dialog.open(NewDrawModalComponent, {});
    }
    handleExportDrawing(): void {
        this.dialog.open(ExportModalComponent, {});
        this.exportService.imagePrevisualization();
        this.exportService.initializeExportParams();
    }

    handleSaveDrawing(): void {
        this.dialog.open(SaveDrawingModalComponent, {});
    }
}
