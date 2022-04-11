import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '@app/services/login/login.service';
import { NAME_MAX_LENGTH, PUBLIC_ALBUM } from '@app/constants/constants';

@Component({
  selector: 'app-create-drawing-dialog',
  templateUrl: './create-drawing-dialog.component.html',
  styleUrls: ['./create-drawing-dialog.component.scss']
})
export class CreateDrawingDialogComponent implements OnInit {
  name: string;
  isPrivate: boolean;

  isEmpty: boolean | undefined;
  isValidLength: boolean | undefined;

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService, private currentDialogRef: MatDialogRef<CreateDrawingDialogComponent>) {
    this.name = "Mon dessin";
    this.isPrivate = false;
    this.albumGalleryService.selectedAlbumName = PUBLIC_ALBUM.name;
    this.albumGalleryService.selectedAlbumId = PUBLIC_ALBUM.id;
    this.isValidInput(this.name);
  }

  ngOnInit(): void {
    this.getAlbums();
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = [];
    this.albumGalleryService.myAlbumsWithoutPublic = [];
  }

  changeAccess(value: number): void {
    this.isPrivate = value == 1;
    if (this.isPrivate) {
      this.albumGalleryService.selectedAlbumName = this.albumGalleryService.myAlbumsWithoutPublic[0].name;
      this.albumGalleryService.selectedAlbumId = this.albumGalleryService.myAlbumsWithoutPublic[0]._id;
    } else {
      this.albumGalleryService.selectedAlbumName = PUBLIC_ALBUM.name;
      this.albumGalleryService.selectedAlbumId = PUBLIC_ALBUM.id;
    }
  }

  createDrawingButton(): void {
    if (this.isValidInput(this.name)) {
      this.albumGalleryService.createDrawing(this.name);
      this.currentDialogRef.close();
    }
  }

  onAlbumClick(album: IAlbum): void {
    this.albumGalleryService.selectedAlbumName = album.name;
    this.albumGalleryService.selectedAlbumId = album._id;
  }

  private getAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  private isValidInput(str: string): boolean {
    this.isEmpty = (str === null || str.match(/^ *$/) !== null);
    this.isValidLength = str.length <= NAME_MAX_LENGTH;
    return !this.isEmpty && this.isValidLength;
}

}
