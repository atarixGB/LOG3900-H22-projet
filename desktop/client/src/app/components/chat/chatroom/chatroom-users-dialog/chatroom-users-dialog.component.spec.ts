import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomUsersDialogComponent } from './chatroom-users-dialog.component';

describe('ChatroomUsersDialogComponent', () => {
  let component: ChatroomUsersDialogComponent;
  let fixture: ComponentFixture<ChatroomUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatroomUsersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatroomUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
