import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
import { PencilConfigComponent } from './pencil-config.component';
// tslint:disable
describe('PencilConfigComponent', () => {
    let component: PencilConfigComponent;
    let fixture: ComponentFixture<PencilConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilConfigComponent, MatSlider],
            imports: [FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format label', () => {
        const param = 8;
        const expectedResult = '8px';
        expect(component.formatLabel(param)).toEqual(expectedResult);
    });
});
