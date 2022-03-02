import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarImportModalComponent } from './avatar-import-modal.component';

describe('AvatarImportModalComponent', () => {
  let component: AvatarImportModalComponent;
  let fixture: ComponentFixture<AvatarImportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarImportModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
