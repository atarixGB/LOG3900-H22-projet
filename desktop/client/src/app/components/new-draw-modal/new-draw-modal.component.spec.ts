import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { NewDrawModalComponent } from './new-draw-modal.component';

// tslint:disable
describe('NewDrawModalComponent', () => {
    let component: NewDrawModalComponent;
    let fixture: ComponentFixture<NewDrawModalComponent>;
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    let newDrawingServiceSpy: jasmine.SpyObj<any>;
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewDrawModalComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                {provide : NewDrawingService, useValue: newDrawingServiceSpy}
            ],
     }).compileComponents();
    }));
    newDrawingServiceSpy = jasmine.createSpyObj('DrawingService', ['requestCleaning']);

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle onclick confirm and close modal',()=> {
        component.handleConfirm();
        expect(newDrawingServiceSpy.requestCleaning).toHaveBeenCalledTimes(1);
        expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
});
