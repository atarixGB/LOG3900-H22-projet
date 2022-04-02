import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedResearchComponent } from './advanced-research.component';

describe('AdvancedResearchComponent', () => {
  let component: AdvancedResearchComponent;
  let fixture: ComponentFixture<AdvancedResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
