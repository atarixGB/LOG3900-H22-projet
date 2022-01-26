import { TestBed } from '@angular/core/testing';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { CanvasTestHelper } from './canvas-test-helper';
import { Rectangle } from './rectangle';
import { Vec2 } from './vec2';

// tslint:disable
describe('Rectangle ', () => {
    let canvasTestHelper:CanvasTestHelper;
    beforeEach(()=>{
        canvasTestHelper=TestBed.inject(CanvasTestHelper);

    });
    it('should create', () => {
        expect(new Rectangle({} as Vec2, 2, 2,TypeStyle.Fill, 2, 'black', 'red')).toBeTruthy();
    });

    it('case Stroke', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const rectangle = new Rectangle({} as Vec2, 2, 2, TypeStyle.Stroke , 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'strokeRect').and.callThrough();

        rectangle.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case Fill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const rectangle = new Rectangle({} as Vec2, 2, 2, TypeStyle.Fill, 2, 'black', 'red');

        const spy = spyOn<any>(ctx, 'fillRect').and.callThrough();

        rectangle.draw(ctx);

        expect(spy).toHaveBeenCalled();
    });

    it('case StrokeFill', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const rectangle = new Rectangle({} as Vec2, 2, 2, TypeStyle.StrokeFill, 2, 'black', 'red');

        const fillStyleSpy = spyOn<any>(ctx, 'fillRect').and.callThrough();
        const strokStyleeSpy = spyOn<any>(ctx, 'strokeRect').and.callThrough();
        rectangle.draw(ctx);

        expect(fillStyleSpy).toHaveBeenCalled();
        expect(strokStyleeSpy).toHaveBeenCalled();
    });
});
