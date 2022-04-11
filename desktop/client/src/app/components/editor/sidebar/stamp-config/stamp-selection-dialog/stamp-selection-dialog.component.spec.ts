import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampSelectionDialogComponent } from './stamp-selection-dialog.component';

describe('StampSelectionDialogComponent', () => {
  let component: StampSelectionDialogComponent;
  let fixture: ComponentFixture<StampSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StampSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StampSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
