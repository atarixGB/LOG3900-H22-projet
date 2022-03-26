import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileDialogComponent } from './view-profile-dialog.component';

describe('ViewProfileDialogComponent', () => {
  let component: ViewProfileDialogComponent;
  let fixture: ComponentFixture<ViewProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProfileDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
