import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { JoinRequestDialogComponent } from '@app/components/album-gallery/public-albums/join-request-dialog/join-request-dialog.component';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { LoginService } from '@app/services/login/login.service';

@Component({
  selector: 'app-public-albums',
  templateUrl: './public-albums.component.html',
  styleUrls: ['./public-albums.component.scss']
})
export class PublicAlbumsComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);

    if (album != null) {
      this.dialog.open(JoinRequestDialogComponent, {
        data: album,
      });
    }
  }

  ngOnDestroy(): void {
    this.albumGalleryService.publicAlbums = [];
  }

}
