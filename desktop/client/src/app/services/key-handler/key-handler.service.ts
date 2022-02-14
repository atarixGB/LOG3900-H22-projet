import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ExportService } from '@app/services/export-image/export.service';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Injectable({
    providedIn: 'root',
})
export class KeyHandlerService {
    canvasSize: Vec2;
    baseCtx: CanvasRenderingContext2D;

    constructor(
        public toolManagerService: ToolManagerService,
        public moveSelectionService: MoveSelectionService,
        public exportService: ExportService,
        public dialog: MatDialog,
        private selectionService: SelectionService,
    ) {}

    handleKeyDown(event: KeyboardEvent): void {
        this.modalHandler(event, NewDrawModalComponent, 'o');
        this.modalHandler(event, SaveDrawingModalComponent, 's');
        this.modalHandler(event, ExportModalComponent, 'e');

        if (this.selectionToolKeyHandler(event)) return;

        if (this.dialog.openDialogs.length < 1) {
            this.toolManagerService.handleHotKeysShortcut(event);
        }
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (this.toolManagerService.currentTool === this.selectionService || this.toolManagerService.currentTool === this.moveSelectionService) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.moveSelectionService.handleKeyUp(event);
            }
        }

        this.toolManagerService.handleKeyUp(event);
    }

    private modalHandler(
        event: KeyboardEvent,
        component: ComponentType<NewDrawModalComponent | SaveDrawingModalComponent | ExportModalComponent>,
        key: string,
    ): void {
        const modalKeysPressed = event.ctrlKey && event.key === key;
        if (modalKeysPressed && this.dialog.openDialogs.length === 0) {
            event.preventDefault();

            switch (event.key) {
                case 'g':
                    this.selectionService.terminateSelection();
                    this.dialog.open(component, { data: this.isCanvasBlank() });
                    break;
                case 'e':
                    this.exportService.imagePrevisualization();
                    this.exportService.initializeExportParams();
                    this.selectionService.terminateSelection();
                    this.dialog.open(component, {});
                    break;
                default:
                    this.selectionService.terminateSelection();
                    this.dialog.open(component, {});
                    break;
            }
        }
    }

    private selectionToolKeyHandler(event: KeyboardEvent): boolean {
        const selectAllKeysPressed = event.ctrlKey && event.key === 'a';
        const selectionServiceIsSelected = this.toolManagerService.currentTool === this.selectionService;
        const moveSelectionServiceIsSelected = this.toolManagerService.currentTool === this.moveSelectionService;

        if (selectAllKeysPressed) {
            event.preventDefault();
            this.toolManagerService.currentToolEnum = ToolList.SelectionRectangle;
            this.selectionService.selectAll();
        }

        if (selectionServiceIsSelected || moveSelectionServiceIsSelected) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.moveSelectionService.handleKeyDown(event);
            }
        }
        return false;
    }

    private isCanvasBlank(): boolean {
        return !this.baseCtx.getImageData(0, 0, this.canvasSize.x, this.canvasSize.y).data.some((channel) => channel !== 0);
    }
}
