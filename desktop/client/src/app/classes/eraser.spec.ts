import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from './canvas-test-helper';
import { Eraser } from './eraser';
import { Vec2 } from './vec2';

// tslint:disable

describe('Eraser', () => {
    let canvasTestHelper:CanvasTestHelper;
    beforeEach(()=>{
        canvasTestHelper=TestBed.inject(CanvasTestHelper);
    });

    it('should create an instance', () => {
        expect(new Eraser(5, [])).toBeTruthy();
    });

    it('draw should call methods for context', () => {
        const ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const point = { x: 2, y: 2 } as Vec2;
        const beginSpy = spyOn<any>(ctxStub, 'beginPath').and.callThrough();
        const stroke = spyOn<any>(ctxStub, 'stroke').and.callThrough();
        const lineTo = spyOn<any>(ctxStub, 'lineTo').and.callThrough();
        const eraser = new Eraser(5, [point, point]);
        eraser.draw(ctxStub);
        expect(beginSpy).toHaveBeenCalled();
        expect(stroke).toHaveBeenCalled();
        expect(lineTo).toHaveBeenCalledTimes(2);
    });
});
