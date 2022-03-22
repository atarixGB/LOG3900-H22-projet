import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersListDialogComponent } from './members-list-dialog.component';

describe('MembersListDialogComponent', () => {
  let component: MembersListDialogComponent;
  let fixture: ComponentFixture<MembersListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
