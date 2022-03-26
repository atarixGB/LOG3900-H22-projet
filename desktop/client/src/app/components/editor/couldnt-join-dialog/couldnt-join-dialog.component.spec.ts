import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouldntJoinDialogComponent } from './couldnt-join-dialog.component';

describe('CouldntJoinDialogComponent', () => {
  let component: CouldntJoinDialogComponent;
  let fixture: ComponentFixture<CouldntJoinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouldntJoinDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouldntJoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
