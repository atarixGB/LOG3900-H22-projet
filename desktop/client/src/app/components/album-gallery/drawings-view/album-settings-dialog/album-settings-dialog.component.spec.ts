import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumSettingsDialogComponent } from './album-settings-dialog.component';

describe('AlbumSettingsDialogComponent', () => {
  let component: AlbumSettingsDialogComponent;
  let fixture: ComponentFixture<AlbumSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumSettingsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
