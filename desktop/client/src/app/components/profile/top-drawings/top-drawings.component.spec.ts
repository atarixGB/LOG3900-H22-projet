import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopDrawingsComponent } from './top-drawings.component';

describe('TopDrawingsComponent', () => {
  let component: TopDrawingsComponent;
  let fixture: ComponentFixture<TopDrawingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopDrawingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopDrawingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
