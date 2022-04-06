import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDrawingNameDialogComponent } from './change-drawing-name-dialog.component';

describe('ChangeDrawingNameDialogComponent', () => {
  let component: ChangeDrawingNameDialogComponent;
  let fixture: ComponentFixture<ChangeDrawingNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDrawingNameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDrawingNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
