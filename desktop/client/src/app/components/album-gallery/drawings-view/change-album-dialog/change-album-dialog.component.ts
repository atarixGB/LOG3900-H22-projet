import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PUBLIC_ALBUM } from '@app/constants/constants';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-change-album-dialog',
  templateUrl: './change-album-dialog.component.html',
  styleUrls: ['./change-album-dialog.component.scss']
})
export class ChangeAlbumDialogComponent implements OnInit {
  newAlbumName: string;
  newAlbumId: string;
  isPrivate: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDrawing , public albumGalleryService: AlbumGalleryService) {
    this.newAlbumId = PUBLIC_ALBUM.id;
  }

  ngOnInit(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  changeAccess(value: number): void {
    this.isPrivate = value == 1;
    if (this.isPrivate) {
      this.newAlbumName = this.albumGalleryService.myAlbumsWithoutPublic[0].name;
      this.newAlbumId = this.albumGalleryService.myAlbumsWithoutPublic[0]._id;
    } else {
      this.newAlbumName = PUBLIC_ALBUM.name;
      this.newAlbumId = PUBLIC_ALBUM.id;
    }
  }

  onAlbumClick(album: IAlbum): void {
    this.newAlbumName = album.name;
    this.newAlbumId = album._id;
  }

  changeAlbum(): void {
    this.albumGalleryService.changeAlbum(this.data, this.newAlbumId);
  }

}
