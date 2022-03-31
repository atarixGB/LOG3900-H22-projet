import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberJoinedDialogComponent } from './member-joined-dialog.component';

describe('MemberJoinedDialogComponent', () => {
  let component: MemberJoinedDialogComponent;
  let fixture: ComponentFixture<MemberJoinedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberJoinedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberJoinedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
