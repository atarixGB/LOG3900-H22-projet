import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SelectionTool } from '@app/classes/selection';
import { ResizeSelectionService } from './resize-selection.service';

// tslint:disable

enum ControlPoints {
    TopLeft = 0,
    TopRight = 1,
    BottomRigth = 2,
    BottomLeft = 3,
    MiddleTop = 4,
    MiddleRight = 5,
    MiddleBottom = 6,
    MiddleLeft = 7,
}

describe('ResizeSelectionService', () => {
    let service: ResizeSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    const OPPOSITE_SIGN = -1;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(ResizeSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service['selectionObject'] = new SelectionTool({ x: 0, y: 0 }, { x: 10, y: 10 }, 10, 10);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call function associate to correct control point', () => {
        service['currentControlPoint'] = ControlPoints.TopLeft;
        const func = () => {};
        const controlPointsBinding = spyOn<any>(service['controlPointsBinding'], 'get').and.returnValue(func);
        service['controlPointInResize']();
        expect(controlPointsBinding).toHaveBeenCalled();
    });

    
    it('should return true if mouse is on a control point', () => {
        const mouseCoord = { x: 10, y: 10 };
        service.controlPointsCoord = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];

        const result = service.checkIfMouseIsOnControlPoint(mouseCoord);
        expect(result).toBeTrue();
    });
    it('should return false if mouse is on a control point', () => {
        const mouseCoord = { x: 40, y: 40 };
        service.controlPointsCoord = [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
        ];

        const result = service.checkIfMouseIsOnControlPoint(mouseCoord);
        expect(result).toBeFalse();
    });

    it('onMouseMove should change the selection and mouse coord', () => {
        const mouseCoord = { x: 0, y: 0 };
        const oldMouseCoords = { x: 10, y: 10 };
        const origin = { x: 0, y: 0 };
        const dest = { x: 0, y: 0 };
        const newOrigin = { x: 10, y: 10 };
        const newDest = { x: 10, y: 10 };
        const width = 10;
        const lenght = 10;
        const oldSelection = new SelectionTool(origin, dest, width, lenght);

        service['selectionObject'] = oldSelection;
        service['mouseCoord'] = oldMouseCoords;

        const newSelection = new SelectionTool(newOrigin, newDest, width, lenght);
        const spyResize = spyOn<any>(service, 'controlPointInResize').and.stub();

        service.onMouseMove(mouseCoord, newSelection);
        expect(spyResize).toHaveBeenCalled();
        expect(service['selectionObject']).toEqual(newSelection);
        expect(service['mouseCoord']).toEqual(mouseCoord);
    });

    it('print resize should print on the canvas', () => {
        const expectedNewOrigin = { x: 0, y: 0 };

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;
        service['selectionObject'].image = new ImageData(10, 10);

        const saveSpy = spyOn(baseCtxStub, 'save').and.stub();
        const restoreSpy = spyOn(baseCtxStub, 'restore').and.stub();

        service.printResize(baseCtxStub);

        expect(service.newOrigin).toEqual(expectedNewOrigin);
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
    });

    it('scontrolPointInResize should not call a resize function if valid control point', () => {
        spyOn(service['controlPointsBinding'], 'has').and.returnValue(false);
        const spyBinding = spyOn(service['controlPointsBinding'], 'get');

        service['controlPointInResize']();

        expect(spyBinding).not.toHaveBeenCalled();
    });

    it('controlPointInResize should call a resize function if valid control point', () => {
        const spyBinding = spyOn(service['controlPointsBinding'], 'get');
        service['currentControlPoint'] = ControlPoints.BottomLeft;

        service['controlPointInResize']();

        expect(spyBinding).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with oposite sign if inverted', () => {
        const expectedResize = -10;
        service.resizeHeight = expectedResize;
        service.resizeWidth = expectedResize;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection = document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(OPPOSITE_SIGN, OPPOSITE_SIGN);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with oposite sign in x but 1 in y if inverted in x axe', () => {
        const expectedResizeX = -10;
        const expectedResizeY = 10;
        const expectedY = 1;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection = document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(OPPOSITE_SIGN, expectedY);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with oposite sign in y but 1 in x if inverted in y axe', () => {
        const expectedResizeX = 10;
        const expectedResizeY = -10;
        const expectedX = 1;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection = document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).toHaveBeenCalledWith(expectedX, OPPOSITE_SIGN);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('checkForMirroirEffect should scale with normal sizes if resize in x and y positive', () => {
        const expectedResizeX = 10;
        const expectedResizeY = 10;
        service.resizeHeight = expectedResizeY;
        service.resizeWidth = expectedResizeX;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        const newSelection = document.createElement('canvas');

        const scaleSpy = spyOn(baseCtxStub, 'scale').and.stub();
        const drawSpy = spyOn(baseCtxStub, 'drawImage').and.stub();

        service['checkForMirroirEffect'](baseCtxStub, newSelection);

        expect(scaleSpy).not.toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('resizeTopLeft should do ajustments for shift', () => {
        const expectedNewOrigin = { x: 5, y: 5 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = true;

        service['resizeTopLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeTopLeft should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 5, y: 5 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeTopLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeTopRight should do ajustments for shift', () => {
        const expectedNewOrigin = { x: 0, y: 5 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = true;

        service['resizeTopRight']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeTopRight should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 0, y: 5 };
        const expectedNewWidth = 0;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeTopRight']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeBottomRight should do ajustments for shift', () => {
        const mouseCOord = { x: 8, y: 8 };
        const expectedNewWidth = 8;
        const expectedNewHeight = 8;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = mouseCOord;
        service.shiftKey = true;

        service['resizeBottomRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeBottomRight should do change the origin and the rezise', () => {
        const mouseCOord = { x: 5, y: 5 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = mouseCOord;
        service.shiftKey = false;

        service['resizeBottomRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeBottomLeft should do ajustments for shift', () => {
        const expectedMouseCoords = { x: 5, y: 0 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedMouseCoords;
        service.shiftKey = true;

        service['resizeBottomLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedMouseCoords);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeBottomLeft should do change the origin and the rezise', () => {
        const expectedMouseCoords = { x: 5, y: 0 };
        const expectedNewWidth = 5;
        const expectedNewHeight = 0;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedMouseCoords;
        service.shiftKey = false;

        service['resizeBottomLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedMouseCoords);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeMiddleTop should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 0, y: 5 };
        const expectedNewWidth = 10;
        const expectedNewHeight = 5;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleTop']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeMiddleRight should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 10, y: 10 };
        const expectedNewWidth = 10;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleRight']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeMiddleBottom should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 10, y: 10 };
        const expectedNewWidth = 10;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleBottom']();

        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('resizeMiddleLeft should do change the origin and the rezise', () => {
        const expectedNewOrigin = { x: 10, y: 0 };
        const expectedNewWidth = 0;
        const expectedNewHeight = 10;

        service['selectionObject'].origin = { x: 0, y: 0 };
        service['selectionObject'].destination = { x: 10, y: 10 };
        service['selectionObject'].width = 10;
        service['selectionObject'].height = 10;

        service['mouseCoord'] = expectedNewOrigin;
        service.shiftKey = false;

        service['resizeMiddleLeft']();

        expect(service['selectionObject'].origin).toEqual(expectedNewOrigin);
        expect(service.resizeWidth).toEqual(expectedNewWidth);
        expect(service.resizeHeight).toEqual(expectedNewHeight);
    });

    it('getSelectionRatio should return the ratio between the width and the height', () => {
        const expectedValue = 1;

        const value = service['getSelectionRatio']();
        expect(value).toEqual(expectedValue);
    });
});
