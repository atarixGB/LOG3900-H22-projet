import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDrawingGalleryComponent } from './public-drawing-gallery.component';

describe('PublicDrawingGalleryComponent', () => {
  let component: PublicDrawingGalleryComponent;
  let fixture: ComponentFixture<PublicDrawingGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicDrawingGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDrawingGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
