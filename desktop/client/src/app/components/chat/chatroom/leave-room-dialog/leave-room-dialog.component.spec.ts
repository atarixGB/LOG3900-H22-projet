import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRoomDialogComponent } from './leave-room-dialog.component';

describe('LeaveRoomDialogComponent', () => {
  let component: LeaveRoomDialogComponent;
  let fixture: ComponentFixture<LeaveRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRoomDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
