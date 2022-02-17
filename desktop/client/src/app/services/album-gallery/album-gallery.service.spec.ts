import { TestBed } from '@angular/core/testing';

import { AlbumGalleryService } from './album-gallery.service';

describe('AlbumGalleryService', () => {
  let service: AlbumGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
