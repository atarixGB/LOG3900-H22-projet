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
  isOpened: boolean;

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService) {
    this.isOpened = false;
  }

  ngOnInit(): void {
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);
    this.isOpened = true;

    if (album != null) {
      this.albumGalleryService.currentAlbum = album;
    }
  }

  onChangePageButtonClick(value: boolean): void {
    this.isOpened = value;
  }

  ngOnDestroy(): void {
    this.albumGalleryService.publicAlbums = [];
  }

}
