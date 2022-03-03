import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumGalleryComponent } from './album-gallery.component';

describe('AlbumGalleryComponent', () => {
  let component: AlbumGalleryComponent;
  let fixture: ComponentFixture<AlbumGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
