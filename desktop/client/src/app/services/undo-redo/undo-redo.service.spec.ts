import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Drawable } from '@app/classes/drawable';
import { LoadedImage } from '@app/classes/loaded-image';
import { Pencil } from '@app/classes/pencil';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from './undo-redo.service';
//tslint:disable
describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let drawServiceStub: DrawingService;
    let addUndoSpy: jasmine.Spy<any>;
    let addRedoSpy: jasmine.Spy<any>;
    let popRedoSpy: jasmine.Spy<any>;
    let popUndoSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.Spy<any>;
    
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceStub = new DrawingService();

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceStub }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(UndoRedoService);
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = baseCtxStub;

        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].previewCanvas = canvasTestHelper.canvas;

        addUndoSpy = spyOn<any>(service['undoStack'], 'add').and.callThrough();
        addRedoSpy = spyOn<any>(service['redoStack'], 'add').and.callThrough();

        popUndoSpy = spyOn<any>(service['undoStack'], 'pop').and.callThrough();
        popRedoSpy = spyOn<any>(service['redoStack'], 'pop').and.callThrough();

        drawServiceSpy = spyOn<any>(service['drawingService'], 'clearCanvas');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#undo should do nothing if the stack is empty', () => {
        service.undo();
        expect(addRedoSpy).not.toHaveBeenCalled();
        expect(popUndoSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy).not.toHaveBeenCalled();
    });

    it('#undo should pop an element from undo stack and add it to redo stack if the stack is empty', () => {
        const drawableStub = new Pencil([], 'red', 1);

        service.addToStack(drawableStub);
        service.addToStack(drawableStub);

        service.undo();
        expect(addRedoSpy).toHaveBeenCalled();
        expect(popUndoSpy).toHaveBeenCalled();
        expect(drawServiceSpy).toHaveBeenCalled();
    });

    it('red() should nothing if redoStack is empty', () => {
        service.redo();
        expect(addUndoSpy).not.toHaveBeenCalled();
        expect(popRedoSpy).not.toHaveBeenCalled();
    });

    it('red() should pop the last element and add it to undo stack', () => {
        const drawableStub = new Pencil([], 'red', 1);
        service.addToStack(drawableStub);
        service['redoStack'].add(drawableStub);

        service.redo();
        expect(addUndoSpy).toHaveBeenCalled();
        expect(popRedoSpy).toHaveBeenCalled();
    });


    it('onKeyDown should do nothing on another keyboard event', () => {
        const keyEvent = {} as KeyboardEvent;
        const redoSpy = spyOn<any>(service, 'redo').and.callThrough();
        const undoSpy = spyOn<any>(service, 'undo').and.callThrough();

        service.onKeyDown(keyEvent);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it('clearStacks should clear both stacks', () => {
        const undoClearSpy = spyOn<any>(service['undoStack'], 'clear').and.callThrough();
        const redoClearSpy = spyOn<any>(service['redoStack'], 'clear').and.callThrough();
        service.cleanStacks();
        expect(undoClearSpy).toHaveBeenCalled();
        expect(redoClearSpy).toHaveBeenCalled();
    });

    it('canUndo should return false if the undo stack is empty', () => {
        service.cleanStacks();
        expect(service.canUndo()).toBe(false);
        expect(service.canRedo()).toBe(false);
    });

    it('undo should draw the image loaded from gallery', () => {
        class DrawableMock extends Drawable {}
        const canvas = canvasTestHelper.canvas;
        const mok = new DrawableMock();
        drawServiceStub.canvas = canvas;
        service['loadImage'].next(new LoadedImage({} as ImageData));
        const spy = spyOn<any>(service.loadImage.getValue(), 'draw').and.callFake(() => {
            return;
        });
        service.addToStack(mok);
        spyOn(service['toolsInUse'], 'getValue').and.returnValue(false);
        service.undo();
        expect(spy).toHaveBeenCalled();
    });

    it('undo should not draw the image if there no image loaded from gallery', () => {
        class DrawableMock extends Drawable {}
        const canvas = canvasTestHelper.canvas;
        const mok = new DrawableMock();
        drawServiceStub.canvas = canvas;
        const spy = spyOn(service['drawingService'].baseCtx, 'drawImage');
        service['loadImage'].next({} as LoadedImage);
        service.addToStack(mok);
        spyOn(service['toolsInUse'], 'getValue').and.returnValue(false);
        service.undo();
        expect(spy).not.toHaveBeenCalled();
    });

    it(' setToolsInUse should change value correctly', () => {
        service.setToolInUse(true);
        expect(service['toolsInUse'].getValue()).toEqual(true);
    });
});
