import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-public-drawing-gallery',
  templateUrl: './public-drawing-gallery.component.html',
  styleUrls: ['./public-drawing-gallery.component.scss']
})
export class PublicDrawingGalleryComponent implements OnInit {

  constructor(private albumGalleryService: AlbumGalleryService) { }

  ngOnInit(): void {
    this.albumGalleryService.fetchAllPublicDrawings();
  }

}
