import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { mouseEventLClick, mouseEventRClick } from '@app/constants/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil.service';

// tslint:disable
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let drawPointSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PencilService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        drawPointSpy = spyOn<any>(service, 'drawPoint').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue(expectedResult);

        service.onMouseDown(mouseEventLClick);

        expect(service.mouseDownCoord).toEqual(expectedResult);
        expect(service['pathData'].length).toEqual(1);
        expect(service['pathData'][0]).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEventLClick);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseUp(mouseEvent);

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('Mouse click should just draw point', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });
        service.onMouseClick(mouseEventLClick);

        expect(drawPointSpy).toHaveBeenCalled();
    });

    it('Mouse click should not be called if mouse is moving', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseMove = true;

        service.onMouseClick(mouseEvent);
        expect(drawPointSpy).not.toHaveBeenCalled();
    });

    it('Draw Point should fill a circle', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseMove = false;

        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseClick(mouseEvent);
        expect(drawPointSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        spyOn(service, 'getPositionFromMouse').and.returnValue({ x: 0, y: 0 });

        service.onMouseDown(mouseEventLClick);
        service.onMouseUp(mouseEventRClick);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).toEqual(0); // A
    });
});
