import { Component, OnInit } from '@angular/core';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { LoginService } from '@app/services/login/login.service';

@Component({
  selector: 'app-public-albums',
  templateUrl: './public-albums.component.html',
  styleUrls: ['./public-albums.component.scss']
})
export class PublicAlbumsComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);

    if (album != null) {
      this.albumGalleryService.fetchDrawingsFromSelectedAlbum(album);
    }
  }

  ngOnDestroy(): void {
    this.albumGalleryService.publicAlbums = [];
  }

}
