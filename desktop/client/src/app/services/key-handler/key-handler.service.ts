import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { CarouselComponent } from '@app/components/carousel/carousel-modal/carousel.component';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { ExportService } from '@app/services/export-image/export.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class KeyHandlerService {
    canvasSize: Vec2;
    baseCtx: CanvasRenderingContext2D;

    constructor(
        public toolManagerService: ToolManagerService,
        public exportService: ExportService,
        public dialog: MatDialog,
        private undoRedoService: UndoRedoService,
    ) {}

    handleKeyDown(event: KeyboardEvent): void {
        this.modalHandler(event, CarouselComponent, 'g');
        this.modalHandler(event, NewDrawModalComponent, 'o');
        this.modalHandler(event, SaveDrawingModalComponent, 's');
        this.modalHandler(event, ExportModalComponent, 'e');

        if (this.dialog.openDialogs.length < 1) {
            this.toolManagerService.handleHotKeysShortcut(event);
        }

        this.undoRedoToolKeyHandler(event);
    }

    handleKeyUp(event: KeyboardEvent): void {
        this.toolManagerService.handleKeyUp(event);
    }

    private modalHandler(
        event: KeyboardEvent,
        component: ComponentType<NewDrawModalComponent | SaveDrawingModalComponent | CarouselComponent | ExportModalComponent>,
        key: string,
    ): void {
        const modalKeysPressed = event.ctrlKey && event.key === key;
        if (modalKeysPressed && this.dialog.openDialogs.length === 0) {
            event.preventDefault();

            switch (event.key) {
                case 'g':
                    this.dialog.open(component, { data: this.isCanvasBlank() });
                    break;
                case 'e':
                    this.exportService.imagePrevisualization();
                    this.exportService.initializeExportParams();
                    this.dialog.open(component, {});
                    break;
                default:
                    this.dialog.open(component, {});
                    break;
            }
        }
    }

    private undoRedoToolKeyHandler(event: KeyboardEvent): void {
        const undoKeysPressed =
            event.ctrlKey && event.key === 'z' && this.undoRedoService.canUndo() && !this.toolManagerService.currentTool?.mouseDown;
        const redoKeysPressed =
            event.ctrlKey &&
            event.shiftKey &&
            event.code === 'KeyZ' &&
            this.undoRedoService.canRedo() &&
            !this.toolManagerService.currentTool?.mouseDown;

        if (undoKeysPressed) {
            event.preventDefault();
            this.undoRedoService.undo();
        }

        if (redoKeysPressed) {
            event.preventDefault();
            this.undoRedoService.redo();
        }
    }

    private isCanvasBlank(): boolean {
        return !this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y).data.some((channel) => channel !== 0);
    }
}
