import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDialogComponent } from './requests-dialog.component';

describe('RequestsDialogComponent', () => {
  let component: RequestsDialogComponent;
  let fixture: ComponentFixture<RequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
