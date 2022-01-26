import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from './canvas-test-helper';
import { TextTool } from './text';
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('TextInput', () => {
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });
    it('should create an instance', () => {
        expect(new TextTool({} as ImageData)).toBeTruthy();
    });
    it(' draw should call putImageData', () => {
        const textTest = new TextTool({} as ImageData);
        const tempImg = {} as ImageData;
        const spy = spyOn<any>(baseCtxStub, 'putImageData');
        textTest.draw(baseCtxStub);
        expect(spy).toHaveBeenCalledWith(tempImg, 0, 0);
    });
});
