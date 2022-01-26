import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MoveSelectionService } from '@app/services/selection/move-selection.service';
import { TextService } from '@app/services/tools/text/text.service';
import { SelectionConfigComponent } from './selection-config.component';


// tslint:disable
describe('SelectionConfigComponent', () => {
    let component: SelectionConfigComponent;
    let fixture: ComponentFixture<SelectionConfigComponent>;
    let moveSelectionServiceSpy: jasmine.SpyObj<MoveSelectionService>;
    let textServiceSpy: jasmine.SpyObj<TextService>;

    beforeEach(async(() => {
        moveSelectionServiceSpy = jasmine.createSpyObj('MoveSelectionService', ['enableMagnetism']);
        textServiceSpy = jasmine.createSpyObj('TextService', ['']);

        TestBed.configureTestingModule({
            providers: [
                { provide: MoveSelectionService, useValue: moveSelectionServiceSpy },
                { provide: TextService, useValue: textServiceSpy },
            ],
            declarations: [SelectionConfigComponent,MatOption],
            imports: [MatSliderModule, MatFormFieldModule, MatSelectModule, FormsModule, BrowserAnimationsModule, MatIconModule,MatSlideToggleModule,MatGridListModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should enable grid magnetism', () => {
        component.enableGridMagnetism(true);
        expect(component.isMagnetismEnabled).toBeTrue();
        expect(moveSelectionServiceSpy.isMagnetism).toBeTrue();
        expect(moveSelectionServiceSpy.enableMagnetism).toHaveBeenCalled();
    });

    it('should turn on magnetism feature if M key is pressed for the first time', () => {
        textServiceSpy.isWriting = false;
        component.isMagnetismEnabled = false;
        moveSelectionServiceSpy.isMagnetism = false;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'm' });

        window.dispatchEvent(keyboardEvent);
        expect(component.isMagnetismEnabled).toBeTrue();
        expect(moveSelectionServiceSpy.isMagnetism).toBeTrue();
    });

    it('should not turn on magnetism feature if M key is pressed and is currently writing', () => {
        textServiceSpy.isWriting = true;
        component.isMagnetismEnabled = false;
        moveSelectionServiceSpy.isMagnetism = false;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'm' });

        window.dispatchEvent(keyboardEvent);
        expect(component.isMagnetismEnabled).toBeFalse();
        expect(moveSelectionServiceSpy.isMagnetism).toBeFalse();
    });
});
