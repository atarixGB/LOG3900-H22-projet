import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { AlphaSliderComponent } from './alpha-slider.component';
// tslint:disable
const CASES_ARRAY = [75, 25, 25, 255];

describe('AlphaSliderComponent', () => {
    let component: AlphaSliderComponent;
    let fixture: ComponentFixture<AlphaSliderComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;

    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['getColorStringAlpha', 'updatePixelColor']);
        colorManagerSpy.getColorStringAlpha.and.returnValue('rgba(255,255,255,1)');
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],

            declarations: [AlphaSliderComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: ColorManagerService, useValue: colorManagerSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlphaSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update gradient with color selected', () => {
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        const pixels: Uint8ClampedArray = new Uint8ClampedArray(CASES_ARRAY);
        const colorPixel: ImageData = new ImageData(pixels, 1, 1);
        contextSpy.getImageData.and.returnValue(colorPixel);
        component.updateColorWithCoordinates({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalled();
    });

    it('should update main gradient if color is updated', () => {
        spyOn(component, 'createAlphaGradiantDisplayer').and.callThrough();
        component.ngOnChanges({
            shouldUpdateGradient: new SimpleChange(undefined, 'rgba(0,0,0,1)', true),
        });
        fixture.detectChanges();
        expect(component.createAlphaGradiantDisplayer).toHaveBeenCalledTimes(0);
        component.ngOnChanges({
            shouldUpdateGradient: new SimpleChange(undefined, 'rgba(255,0,0,1)', false),
        });
        fixture.detectChanges();
        expect(component.createAlphaGradiantDisplayer).toHaveBeenCalled();
        component.ngOnChanges({
            shouldUpdateForAlpha: new SimpleChange(undefined, 'rgba(255,0,0,0.5)', false),
        });
        fixture.detectChanges();
        expect(component.createAlphaGradiantDisplayer).toHaveBeenCalledTimes(2);
    });

    it('should not update main gradient if color is  not updated', () => {
        spyOn(component, 'createAlphaGradiantDisplayer').and.callThrough();
        component.ngOnChanges({
            shouldUpdateGradient: new SimpleChange(undefined, 'rgba(255,0,0,0.5)', true),
        });
        fixture.detectChanges();
        expect(component.createAlphaGradiantDisplayer).not.toHaveBeenCalled();
    });
    it('should update color if user clic on gradient', () => {
        spyOn(component, 'updateColorWithCoordinates').and.callThrough();
        const mockMouseClick = new MouseEvent('mousedown');
        component.mouseDownFromGradient(mockMouseClick);
        fixture.detectChanges();
        expect(component.updateColorWithCoordinates).toHaveBeenCalled();
    });

    it('should not update gradient with color palette', () => {
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        contextSpy.getImageData.and.returnValue({ data: undefined });
        component.colorSliderContext = contextSpy;
        component.updateColorWithCoordinates({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).not.toHaveBeenCalled();
    });
});
