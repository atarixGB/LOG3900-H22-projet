import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from '@app/constants/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ColorPaletteComponent } from './color-palette.component';

// tslint:disable
describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;
    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['getColorStringAlpha', 'updatePixelColor']);
        colorManagerSpy.getColorStringAlpha.and.returnValue('rgba(255,255,255,1)');

        colorManagerSpy.getColorStringAlpha.and.returnValue('rgba(255,255,255,1)');
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['updatePixelColor']);
        colorManagerSpy.selectedColor = new Array<RGBA>();

        colorManagerSpy.selectedColor[ColorOrder.PrimaryColor] = FIRSTCOLORTEST;
        colorManagerSpy.selectedColor[ColorOrder.SecondaryColor] = SECONDCOLORTEST;
    });
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [ColorPaletteComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: ColorOrder.PrimaryColor },
                { provide: ColorManagerService, useValue: colorManagerSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update gradient with color picked', () => {
        component.updateColorWithCoordinates({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(1);
    });

    it('should not update gradient with color picked', () => {
        component.updateColorWithCoordinates({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalled();
    });

    it('should update main gradient if color is updated', () => {
        spyOn(component, 'createMainGradientDisplayer').and.callThrough();
        component.ngOnChanges({
            shouldUpdateGradient: new SimpleChange(undefined, 'rgba(0,0,0,1)', true),
        });
        fixture.detectChanges();
        expect(component.createMainGradientDisplayer).toHaveBeenCalledTimes(0);
        component.ngOnChanges({
            shouldUpdateGradient: new SimpleChange(undefined, 'rgba(255,0,0,1)', false),
        });
        fixture.detectChanges();
        expect(component.createMainGradientDisplayer).toHaveBeenCalledTimes(1);
    });

    it('should update color if user clic on gradient', () => {
        component.colorOrder = ColorOrder.PrimaryColor;
        spyOn(component.shouldUpdateForAlpha, 'emit');
        const mockMouse = new MouseEvent('mousedown');

        component.mouseDownFromGradient(mockMouse);
        fixture.detectChanges();
        expect(component.shouldUpdateForAlpha.emit).toHaveBeenCalled();
    });
});
