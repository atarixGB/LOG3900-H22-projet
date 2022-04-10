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

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService, private currentDialogRef: MatDialogRef<CreateDrawingDialogComponent>) {
    this.name = "";
    this.isPrivate = false;
    this.albumGalleryService.selectedAlbumName = PUBLIC_ALBUM.name;
    this.albumGalleryService.selectedAlbumId = PUBLIC_ALBUM.id;
  }

  ngOnInit(): void {
    this.getAlbums();
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = [];
  }

  changeAccess(value: number): void {
    this.isPrivate = value == 1;
    if (this.isPrivate) {
      this.albumGalleryService.selectedAlbumName = this.albumGalleryService.myAlbums[0].name;
      this.albumGalleryService.selectedAlbumId = this.albumGalleryService.myAlbums[0]._id;
    } else {
      this.albumGalleryService.selectedAlbumName = PUBLIC_ALBUM.name;
      this.albumGalleryService.selectedAlbumId = PUBLIC_ALBUM.id;
    }
  }

  createDrawingButton(): void {
    console.log("createDrawingButton\n",this.name, this.albumGalleryService.selectedAlbumName, this.albumGalleryService.selectedAlbumId);

    if (this.isValidInput(this.name) && this.name.length <= NAME_MAX_LENGTH) {
      this.albumGalleryService.createDrawing(this.name);
      this.currentDialogRef.close();
    } else {
      // TODO: UI feedback. Following line is temporary
      alert("Le dessin doit avoir un nom et posséder moins de 40 caractères.");
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
    return !(str === null || str.match(/^ *$/) !== null);
}

}
