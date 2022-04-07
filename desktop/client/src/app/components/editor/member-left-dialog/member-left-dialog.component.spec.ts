import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLeftDialogComponent } from './member-left-dialog.component';

describe('MemberLeftDialogComponent', () => {
  let component: MemberLeftDialogComponent;
  let fixture: ComponentFixture<MemberLeftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberLeftDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLeftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
