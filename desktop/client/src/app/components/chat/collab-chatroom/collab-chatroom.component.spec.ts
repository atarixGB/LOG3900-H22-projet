import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabChatroomComponent } from './collab-chatroom.component';

describe('CollabChatroomComponent', () => {
  let component: CollabChatroomComponent;
  let fixture: ComponentFixture<CollabChatroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabChatroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
