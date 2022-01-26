import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from './canvas-test-helper';
import { Line } from './line';
import { Vec2 } from './vec2';

// tslint:disable

describe('Line', () => {
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
    });
    it('should create an instance', () => {
        const path: Vec2[] = [{ x: 2, y: 3 }];
        expect(new Line(path, 'red', 5, 2, false)).toBeTruthy();
    });

    it('should context methods if contain more than one element', () => {
        const ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const path: Vec2[] = [
            { x: 2, y: 3 },
            { x: 2, y: 4 },
        ];
        const line = new Line(path, 'red', 5, 2, true);
        const beginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        const fill = spyOn<any>(ctxStub, 'fill').and.callThrough();
        const stroke = spyOn<any>(ctxStub, 'stroke').and.callThrough();
        line.draw(ctxStub);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(stroke).toHaveBeenCalled();
        expect(fill).toHaveBeenCalled();
    });

    it('should call lineTo if joinPoint is false', () => {
        const ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const path: Vec2[] = [
            { x: 2, y: 3 },
            { x: 2, y: 4 },
        ];
        const line = new Line(path, 'red', 5, 2, false);
        const lineTo = spyOn<any>(ctxStub, 'lineTo').and.callThrough();
        line.draw(ctxStub);
        expect(lineTo).toHaveBeenCalled();
    });

    it('should do nothing if there is one in the path', () => {
        const ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const path: Vec2[] = [{ x: 2, y: 3 }];
        const line = new Line(path, 'red', 5, 2, true);
        const beginPathSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        const fill = spyOn<any>(ctxStub, 'fill').and.callThrough();
        const stroke = spyOn<any>(ctxStub, 'stroke').and.callThrough();
        line.draw(ctxStub);
        expect(beginPathSpy).not.toHaveBeenCalled();
        expect(stroke).not.toHaveBeenCalled();
        expect(fill).not.toHaveBeenCalled();
    });
});
