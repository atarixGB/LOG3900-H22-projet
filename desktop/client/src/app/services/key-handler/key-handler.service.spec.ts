import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CarouselComponent } from '@app/components/carousel/carousel-modal/carousel.component';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { ExportService } from '@app/services/export-image/export.service';
import { ClipboardService } from '@app/services/selection/clipboard.service';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { KeyHandlerService } from './key-handler.service';

// tslint:disable
describe('KeyHandlerService', () => {
    let service: KeyHandlerService;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;
    let moveSelectionServiceSpy: jasmine.SpyObj<MoveSelectionService>;
    let exportServiceSpy: jasmine.SpyObj<ExportService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
    let baseCtxSpy: CanvasRenderingContext2D;
    let canvasTestHelperSpy: CanvasTestHelper;

    let keyboardEvent: KeyboardEvent;
    let matDialogRef = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['handleHotKeysShortcut', 'handleKeyUp']);
        exportServiceSpy = jasmine.createSpyObj('ExportService', ['imagePrevisualization', 'initializeExportParams']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['handleKeyUp', 'selectAll', 'terminateSelection']);
        moveSelectionServiceSpy = jasmine.createSpyObj('SelectionService', ['handleKeyUp', 'handleKeyDown']);
        clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', ['actionsAreAvailable', 'copy', 'cut', 'paste', 'delete']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo', 'canUndo', 'canRedo']);
        baseCtxSpy = jasmine.createSpyObj('CanvasRendringContext', ['getImageData']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule, BrowserAnimationsModule, HttpClientTestingModule],
            providers: [
                {
                    provide: ToolManagerService,
                    useValue: toolManagerServiceSpy,
                },
                {
                    provide: MoveSelectionService,
                    useValue: moveSelectionServiceSpy,
                },
                {
                    provide: ExportService,
                    useValue: exportServiceSpy,
                },
                {
                    provide: UndoRedoService,
                    useValue: undoRedoServiceSpy,
                },
                {
                    provide: SelectionService,
                    useValue: selectionServiceSpy,
                },
                {
                    provide: ClipboardService,
                    useValue: clipboardServiceSpy,
                },
                {
                    provide: MatDialogRef,
                    useValue: matDialogRef,
                },
                {
                    provide: CanvasRenderingContext2D,
                    useValue: baseCtxSpy,
                },
            ],
        });
        service = TestBed.inject(KeyHandlerService);
        canvasTestHelperSpy = TestBed.inject(CanvasTestHelper);
        service.baseCtx = baseCtxSpy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open NewDrawing modal if CTRL+O is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'o', preventDefault(): void {} } as KeyboardEvent;
        const modalHandlerSpy = spyOn<any>(service, 'modalHandler').and.stub();
        const selectionToolKeyHandlerSpy = spyOn<any>(service, 'selectionToolKeyHandler').and.stub();
        const undoRedoToolKeyHandlerSpy = spyOn<any>(service, 'undoRedoToolKeyHandler').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(modalHandlerSpy).toHaveBeenCalledTimes(4);
        expect(selectionToolKeyHandlerSpy).toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleHotKeysShortcut).toHaveBeenCalled();
        expect(undoRedoToolKeyHandlerSpy).toHaveBeenCalled();
    });

    it('should open Carousel modal if CTRL+G is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'g', preventDefault(): void {} } as KeyboardEvent;
        const modalHandlerSpy = spyOn<any>(service, 'modalHandler').and.stub();
        const selectionToolKeyHandlerSpy = spyOn<any>(service, 'selectionToolKeyHandler').and.stub();
        const undoRedoToolKeyHandlerSpy = spyOn<any>(service, 'undoRedoToolKeyHandler').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(modalHandlerSpy).toHaveBeenCalledTimes(4);
        expect(selectionToolKeyHandlerSpy).toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleHotKeysShortcut).toHaveBeenCalled();
        expect(undoRedoToolKeyHandlerSpy).toHaveBeenCalled();
    });

    it('should open ExportDrawing modal if CTRL+E is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'e', preventDefault(): void {} } as KeyboardEvent;
        const modalHandlerSpy = spyOn<any>(service, 'modalHandler').and.stub();
        const selectionToolKeyHandlerSpy = spyOn<any>(service, 'selectionToolKeyHandler').and.stub();
        const undoRedoToolKeyHandlerSpy = spyOn<any>(service, 'undoRedoToolKeyHandler').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(modalHandlerSpy).toHaveBeenCalledTimes(4);
        expect(selectionToolKeyHandlerSpy).toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleHotKeysShortcut).toHaveBeenCalled();
        expect(undoRedoToolKeyHandlerSpy).toHaveBeenCalled();
    });

    it('should open SaveDrawing modal if CTRL+S is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 's', preventDefault(): void {} } as KeyboardEvent;
        const modalHandlerSpy = spyOn<any>(service, 'modalHandler').and.stub();
        const selectionToolKeyHandlerSpy = spyOn<any>(service, 'selectionToolKeyHandler').and.stub();
        const undoRedoToolKeyHandlerSpy = spyOn<any>(service, 'undoRedoToolKeyHandler').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(modalHandlerSpy).toHaveBeenCalledTimes(4);
        expect(selectionToolKeyHandlerSpy).toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleHotKeysShortcut).toHaveBeenCalled();
        expect(undoRedoToolKeyHandlerSpy).toHaveBeenCalled();
    });

    it('should not call undoRedoToolKeyHandler if selectionToolKeyHandler returns true', () => {
        keyboardEvent = { ctrlKey: true, key: 'o', preventDefault(): void {} } as KeyboardEvent;
        spyOn<any>(service, 'modalHandler').and.stub();
        spyOn<any>(service, 'selectionToolKeyHandler').and.returnValue(true);
        const undoRedoToolKeyHandlerSpy = spyOn<any>(service, 'undoRedoToolKeyHandler').and.stub();

        service.handleKeyDown(keyboardEvent);
        expect(undoRedoToolKeyHandlerSpy).not.toHaveBeenCalled();
    });

    it('should call handleKeyUp of moveSelection service if currentTool is selectionService and arrow key is pressed', () => {
        keyboardEvent = { key: 'ArrowRight', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;

        service.handleKeyUp(keyboardEvent);
        expect(moveSelectionServiceSpy.handleKeyUp).toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should not call handleKeyUp of moveSelectionService if currentTool is moveSelectionService and no arrow key is pressed', () => {
        keyboardEvent = { key: 'x', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = moveSelectionServiceSpy;

        service.handleKeyUp(keyboardEvent);
        expect(moveSelectionServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should not call handleKeyUp of moveSelectionService if currentTool is undefined', () => {
        keyboardEvent = {} as KeyboardEvent;
        toolManagerServiceSpy.currentTool = undefined;

        service.handleKeyUp(keyboardEvent);
        expect(moveSelectionServiceSpy.handleKeyUp).not.toHaveBeenCalled();
        expect(toolManagerServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('should open Carousel modal if CTRL+G is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'g', preventDefault(): void {} } as KeyboardEvent;
        const openDialogSpy = spyOn<any>(service.dialog, 'open').and.stub();
        const isCanvasBlankSpy = spyOn<any>(service, 'isCanvasBlank').and.stub();

        service['modalHandler'](keyboardEvent, CarouselComponent, 'g');
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(openDialogSpy).toHaveBeenCalled();
        expect(isCanvasBlankSpy).toHaveBeenCalled();
    });

    it('should open Export modal if CTRL+E is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'e', preventDefault(): void {} } as KeyboardEvent;
        const openDialogSpy = spyOn<any>(service.dialog, 'open').and.stub();

        service['modalHandler'](keyboardEvent, ExportModalComponent, 'e');
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(openDialogSpy).toHaveBeenCalled();
        expect(exportServiceSpy.imagePrevisualization).toHaveBeenCalled();
        expect(exportServiceSpy.initializeExportParams).toHaveBeenCalled();
    });

    it('should open Save modal if CTRL+S is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 's', preventDefault(): void {} } as KeyboardEvent;
        const openDialogSpy = spyOn<any>(service.dialog, 'open').and.stub();

        service['modalHandler'](keyboardEvent, SaveDrawingModalComponent, 's');
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(openDialogSpy).toHaveBeenCalled();
    });

    it('should not open modal if CTRL key is not pressed', () => {
        keyboardEvent = { ctrlKey: false, key: 's', preventDefault(): void {} } as KeyboardEvent;
        const openDialogSpy = spyOn<any>(service.dialog, 'open').and.stub();

        service['modalHandler'](keyboardEvent, SaveDrawingModalComponent, 's');
        expect(openDialogSpy).not.toHaveBeenCalled();
    });

    it('should select all canvas if selectAllKeysPressed is true', () => {
        keyboardEvent = { ctrlKey: true, key: 'a', preventDefault(): void {} } as KeyboardEvent;

        service['selectionToolKeyHandler'](keyboardEvent);
        expect(service.toolManagerService.currentToolEnum).toEqual(ToolList.SelectionRectangle);
        expect(selectionServiceSpy.selectAll).toHaveBeenCalled();
    });

    it('should copy selection if selectionServiceIsSelected or moveSelectionServiceIsSelected is true', () => {
        keyboardEvent = { ctrlKey: true, key: 'c', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.actionsAreAvailable.and.returnValue(true);

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.copy).toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should not copy selection if selectionServiceIsSelected and actions are not available', () => {
        keyboardEvent = { ctrlKey: true, key: 'c', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.actionsAreAvailable.and.returnValue(false);

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.copy).not.toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should cut selection if selectionServiceIsSelected or moveSelectionServiceIsSelected is true', () => {
        keyboardEvent = { ctrlKey: true, key: 'x', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.actionsAreAvailable.and.returnValue(true);

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.cut).toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should not cut selection if selectionServiceIsSelected and actions are not available', () => {
        keyboardEvent = { ctrlKey: true, key: 'x', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.actionsAreAvailable.and.returnValue(false);

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.cut).not.toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should paste selection if selectionServiceIsSelected or moveSelectionServiceIsSelected is true', () => {
        keyboardEvent = { ctrlKey: true, key: 'v', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.pasteAvailable = true;

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.paste).toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should not paste selection if selectionServiceIsSelected and paste is not available', () => {
        keyboardEvent = { ctrlKey: true, key: 'v', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.pasteAvailable = false;

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.paste).not.toHaveBeenCalled();
        expect(result).toBeTrue();
    });

    it('should delete selection if Delete key is pressed and actions are available', () => {
        keyboardEvent = { key: 'Delete', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        clipboardServiceSpy.actionsAreAvailable.and.returnValue(true);

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(clipboardServiceSpy.delete).toHaveBeenCalled();
        expect(result).toBeFalse();
    });

    it('should call handleKeyDown of MoveSelectionService if an arrow key is pressed', () => {
        keyboardEvent = { key: 'ArrowRight', preventDefault(): void {} } as KeyboardEvent;
        toolManagerServiceSpy.currentTool = selectionServiceSpy;

        const result = service['selectionToolKeyHandler'](keyboardEvent);
        expect(moveSelectionServiceSpy.handleKeyDown).toHaveBeenCalled();
        expect(result).toBeFalse();
    });

    it('should undo action if CTRL+Z is pressed', () => {
        keyboardEvent = { ctrlKey: true, key: 'z', preventDefault(): void {} } as KeyboardEvent;
        undoRedoServiceSpy.canUndo.and.returnValue(true);
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        toolManagerServiceSpy.currentTool.mouseDown = false;

        service['undoRedoToolKeyHandler'](keyboardEvent);
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(undoRedoServiceSpy.undo).toHaveBeenCalled();
    });

    it('should not undo action if currentTool is undefined', () => {
        keyboardEvent = { ctrlKey: true, key: 'z', preventDefault(): void {} } as KeyboardEvent;
        undoRedoServiceSpy.canUndo.and.returnValue(true);
        toolManagerServiceSpy.currentTool = undefined;

        service['undoRedoToolKeyHandler'](keyboardEvent);
        expect(undoRedoServiceSpy.undo).toHaveBeenCalled();
    });

    it('should redo action if CTRL+Shift+Z is pressed', () => {
        keyboardEvent = { ctrlKey: true, shiftKey: true, code: 'KeyZ', preventDefault(): void {} } as KeyboardEvent;
        undoRedoServiceSpy.canRedo.and.returnValue(true);
        toolManagerServiceSpy.currentTool = selectionServiceSpy;
        toolManagerServiceSpy.currentTool.mouseDown = false;

        service['undoRedoToolKeyHandler'](keyboardEvent);
        expect(undoRedoServiceSpy.redo).toHaveBeenCalled();
    });

    it('should not redo action if currentTool is undefined', () => {
        keyboardEvent = { ctrlKey: true, shiftKey: true, code: 'KeyZ', preventDefault(): void {} } as KeyboardEvent;
        undoRedoServiceSpy.canRedo.and.returnValue(true);
        toolManagerServiceSpy.currentTool = undefined;

        service['undoRedoToolKeyHandler'](keyboardEvent);
        expect(undoRedoServiceSpy.redo).toHaveBeenCalled();
    });

    it('shoud return true if canvas is blank', () => {
        service.canvasSize = { x: 10, y: 10 };
        service.baseCtx = canvasTestHelperSpy.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn<any>(service.baseCtx.getImageData(0, 0, 10, 10).data, 'some').and.returnValue(true);

        const result = service['isCanvasBlank']();
        expect(result).toBeTrue();
    });
});
