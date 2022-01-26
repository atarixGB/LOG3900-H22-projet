import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from '@app/constants/constants';
import { ColorDisplayerComponent } from 'src/app/components/sidebar/color-components/color-displayer/color-displayer.component';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ColorPickerComponent } from './color-picker.component';
// tslint:disable

class EventMock {
    button: number = 2;
    preventDefault(): boolean {
        return false;
    }
}
class SecondEventMock {
    button: number = 0;
    preventDefault(): boolean {
        return false;
    }
}
class ThirdEventMock {
    button: number = 1;
    preventDefault(): boolean {
        return false;
    }
}

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;
    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['updatePixelColor']);
        colorManagerSpy.selectedColor = new Array<RGBA>();
        colorManagerSpy.selectedColor[ColorOrder.PrimaryColor] = FIRSTCOLORTEST;
        colorManagerSpy.selectedColor[ColorOrder.SecondaryColor] = SECONDCOLORTEST;
    });
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, MatDialogModule, HttpClientModule],
            declarations: [ColorPickerComponent, ColorDisplayerComponent],
            providers: [{ provide: ColorManagerService, useValue: colorManagerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should prevent context menu from opening', () => {
        const clickSpy = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component['eventListeners'].contextMenu(clickSpy);
        expect(clickSpy.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should change secondary color when right button of mouse down', () => {
        const pickPixelColorSpy = spyOn<any>(component, 'pickPixelColor').and.stub();
        let eventMock = new EventMock();
        component['onMouseDown'](eventMock as any);
        expect(pickPixelColorSpy).toHaveBeenCalledWith(component.coord, ColorOrder.SecondaryColor);
    });
    it('should change primary color when left button of mouse down', () => {
        const pickPixelColorSpy = spyOn<any>(component, 'pickPixelColor').and.stub();
        let eventMock = new SecondEventMock();
        component['onMouseDown'](eventMock as any);
        expect(pickPixelColorSpy).toHaveBeenCalledWith(component.coord, ColorOrder.PrimaryColor);
    });
    it('should not change when wrong button of mouse down', () => {
        const pickPixelColorSpy = spyOn<any>(component, 'pickPixelColor').and.stub();
        let eventMock = new ThirdEventMock();
        component['onMouseDown'](eventMock as any);
        expect(pickPixelColorSpy).toHaveBeenCalledTimes(0);
    });
    it('should not change when colorPixels does not exist', () => {
        const contextSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        component.context = contextSpy;
        contextSpy.getImageData.and.returnValue({ data: undefined });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(0);
    });
});
