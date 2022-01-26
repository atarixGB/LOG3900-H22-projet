import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextConfigComponent } from './text-config.component';


//tslint:disable
describe('TextConfigComponent', () => {
  let component: TextConfigComponent;
  let fixture: ComponentFixture<TextConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextConfigComponent ],
      imports: [MatSliderModule, MatFormFieldModule, MatSelectModule, FormsModule, BrowserAnimationsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should recreate format label', () => {
    const expectedResult = '5px';
    const param = 5;
    expect(component.formatLabel(param)).toEqual(expectedResult);
});
});
