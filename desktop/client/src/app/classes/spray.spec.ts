import { TestBed } from '@angular/core/testing';
import { Spray } from '@app/classes/spray';
import { CanvasTestHelper } from './canvas-test-helper';
//tslint:disable
describe('Spray', () => {
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
    });
    let image: ImageData;
    it('should create an instance', () => {
        expect(new Spray(image)).toBeTruthy();
    });

    it('draw should update context with image data', () => {
        const ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const spray = new Spray(image);
        const spy = spyOn<any>(ctx, 'putImageData');
        spray.draw(ctx);
        expect(spy).toHaveBeenCalled();
    });
});
