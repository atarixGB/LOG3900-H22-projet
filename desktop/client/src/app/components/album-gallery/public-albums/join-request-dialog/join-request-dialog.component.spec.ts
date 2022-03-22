import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinRequestDialogComponent } from './join-request-dialog.component';

describe('JoinRequestDialogComponent', () => {
  let component: JoinRequestDialogComponent;
  let fixture: ComponentFixture<JoinRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
