import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeSnackbarComponent } from './like-snackbar.component';

describe('LikeSnackbarComponent', () => {
  let component: LikeSnackbarComponent;
  let fixture: ComponentFixture<LikeSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
