import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDrawingDialogComponent } from './delete-drawing-dialog.component';

describe('DeleteDrawingDialogComponent', () => {
  let component: DeleteDrawingDialogComponent;
  let fixture: ComponentFixture<DeleteDrawingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDrawingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
