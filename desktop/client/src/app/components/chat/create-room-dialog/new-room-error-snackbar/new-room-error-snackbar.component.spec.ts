import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomErrorSnackbarComponent } from './new-room-error-snackbar.component';

describe('NewRoomErrorSnackbarComponent', () => {
  let component: NewRoomErrorSnackbarComponent;
  let fixture: ComponentFixture<NewRoomErrorSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRoomErrorSnackbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoomErrorSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
