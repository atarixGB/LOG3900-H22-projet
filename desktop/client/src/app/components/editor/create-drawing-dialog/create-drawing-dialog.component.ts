import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '@app/services/login/login.service';

const MAX_NAME_LENGTH = 40;
@Component({
  selector: 'app-create-drawing-dialog',
  templateUrl: './create-drawing-dialog.component.html',
  styleUrls: ['./create-drawing-dialog.component.scss']
})
export class CreateDrawingDialogComponent implements OnInit {
  name: string;
  isPrivate: boolean;
  selectedAlbumName: string;
  selectedAlbumId: string | void;

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService, private currentDialogRef: MatDialogRef<CreateDrawingDialogComponent>) {
    this.name = "dessin1";
    this.isPrivate = false;
    this.selectedAlbumName = "public (par défaut)";
    this.selectedAlbumId = "id";
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
      this.selectedAlbumName = this.albumGalleryService.myAlbums[0].name;
      this.selectedAlbumId = this.albumGalleryService.myAlbums[0]._id;
    } else {
      this.selectedAlbumName = "public (par défaut)";
      this.selectedAlbumId = "id"; // CHANGE FOR PUBLIC ALBUM ID
    }
  }

  createDrawingButton(): void {
    console.log("createDrawingButton\n",this.name, this.selectedAlbumName, this.selectedAlbumId);

    if (this.isValidInput(this.name) && this.name.length <= MAX_NAME_LENGTH) {
      this.albumGalleryService.createDrawing(this.name);
      this.currentDialogRef.close();
    } else {
      // TODO: UI feedback
      console.log("Le dessin doit avoir un nom ou doit avoir moins de 40 caractères.");
      console.log("nb de char:", this.name.length);
    }
  }

  onAlbumClick(album: IAlbum): void {
    this.selectedAlbumName = album.name;
    this.selectedAlbumId = album._id;
    console.log("onAlbumClick",this.selectedAlbumName, this.selectedAlbumId);
  }

  private getAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
}

}
