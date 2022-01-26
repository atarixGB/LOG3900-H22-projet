import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SprayService } from '@app/services/tools/spray/spray.service';
import { SprayConfigComponent } from './spray-config.component';


// tslint:disable
describe('SprayConfigComponent', () => {
  let component: SprayConfigComponent;
  let fixture: ComponentFixture<SprayConfigComponent>;
  let sprayServiceSpy: jasmine.SpyObj<SprayService>;

  beforeEach(async(() => {
    sprayServiceSpy = jasmine.createSpyObj('SprayService', ['changeWidth', 'changeDotWidth', 'changeSprayFrequency']);
    sprayServiceSpy.width = 5;
    sprayServiceSpy.dotWidth = 10;
    sprayServiceSpy.sprayFrequency = 15;

    TestBed.configureTestingModule({
      providers: [{ provide: SprayService, useValue: sprayServiceSpy }],
      declarations: [ SprayConfigComponent ],
      imports: [MatSliderModule, FormsModule, BrowserAnimationsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('constructor should set right attributes', () => {
      expect(component.sprayWidth).toEqual(5);
      expect(component.dotWidth).toEqual(10);
      expect(component.sprayFrequency).toEqual(15);
  });

  it('changeWidth should set spraywidth', () => {
    component.sprayWidth = 0;
    const newWidth = 15;

    component.changeWidth(newWidth);

    expect(component.sprayWidth).toEqual(newWidth);
});

  it('changeWidth should call sprayService.changeWidth', () => {
    const newWidth = 15;

    component.changeWidth(newWidth);

    expect(component.sprayService.changeWidth).toHaveBeenCalledWith(newWidth);
  });

  it('changeDotWidth should set dotWidth', () => {
    component.dotWidth = 0;
    const newWidth = 15;

    component.changeDotWidth(newWidth);

    expect(component.dotWidth).toEqual(newWidth);
});

it('changeDotWidth should call sprayService.changeWidth', () => {
    const newWidth = 15;

    component.changeDotWidth(newWidth);

    expect(component.sprayService.changeDotWidth).toHaveBeenCalledWith(newWidth);
});

it('changeSprayFrequency should set sprayFrequency', () => {
    component.sprayFrequency = 0;
    const newSprayFrequency = 15;

    component.changeSprayFrequency(newSprayFrequency);

    expect(component.sprayFrequency).toEqual(newSprayFrequency);
});

it('changeSprayFrequency should call sprayService.changeSprayFrequency', () => {
    const newSprayFrequency = 15;

    component.changeSprayFrequency(newSprayFrequency);

    expect(component.sprayService.changeSprayFrequency).toHaveBeenCalledWith(newSprayFrequency);
});

});
