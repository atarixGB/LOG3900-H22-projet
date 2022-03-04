import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingsViewComponent } from './drawings-view.component';

describe('DrawingsViewComponent', () => {
  let component: DrawingsViewComponent;
  let fixture: ComponentFixture<DrawingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
