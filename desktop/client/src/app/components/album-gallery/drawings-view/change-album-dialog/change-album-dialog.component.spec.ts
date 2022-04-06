import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAlbumDialogComponent } from './change-album-dialog.component';

describe('ChangeAlbumDialogComponent', () => {
  let component: ChangeAlbumDialogComponent;
  let fixture: ComponentFixture<ChangeAlbumDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAlbumDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAlbumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
