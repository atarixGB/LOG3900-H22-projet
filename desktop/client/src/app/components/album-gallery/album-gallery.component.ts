import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service'
@Component({
  selector: 'app-album-gallery',
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit {

  constructor(private albumGalleryService: AlbumGalleryService) { }

  ngOnInit(): void {
    this.getAllUserAlbums();
  }

  createAlbumButton(): void {
    // TODO
  }

  deleteAlbumButton(): void {
    // TODO
  }

  viewAlbumButton(): void {
    // TODO
  }

  private getAllUserAlbums(): void {
    // TODO
    this.albumGalleryService.fetchAlbumsFromDatabase();
  }

}
