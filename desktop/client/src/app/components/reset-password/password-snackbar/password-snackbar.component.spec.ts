import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSnackbarComponent } from './password-snackbar.component';

describe('PasswordSnackbarComponent', () => {
  let component: PasswordSnackbarComponent;
  let fixture: ComponentFixture<PasswordSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
