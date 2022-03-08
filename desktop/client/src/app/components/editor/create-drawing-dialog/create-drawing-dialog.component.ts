import { Component, OnInit } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { IAlbum } from '@app/interfaces-enums/IAlbum'
import { MatDialogRef } from '@angular/material/dialog';

const MAX_NAME_LENGTH = 40;
@Component({
  selector: 'app-create-drawing-dialog',
  templateUrl: './create-drawing-dialog.component.html',
  styleUrls: ['./create-drawing-dialog.component.scss']
})
export class CreateDrawingDialogComponent implements OnInit {
  name: string;
  isPrivate: boolean;
  selectedAlbum: string;

  constructor(public albumGalleryService: AlbumGalleryService, private currentDialogRef: MatDialogRef<CreateDrawingDialogComponent>) {
    this.name = "dessin1";
    this.isPrivate = false;
    this.selectedAlbum = "public (par défaut)";
  }

  ngOnInit(): void {
    this.getAlbums();
    console.log(this.albumGalleryService.myAlbums)
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = [];
  }

  changeAccess(value: number): void {
    this.isPrivate = value == 1;
    if (this.isPrivate) {
      this.selectedAlbum = this.albumGalleryService.myAlbums[0].name;
    } else {
      this.selectedAlbum = "public (par défaut)";
    }
    console.log(this.isPrivate? "private" : "public");
  }

  createDrawingButton(): void {
    if (this.isValidInput(this.name) && this.name.length <= MAX_NAME_LENGTH) {
      this.albumGalleryService.createDrawing(this.name, this.isPrivate, this.selectedAlbum);
      this.currentDialogRef.close();
    } else {
      // TODO: UI feedback
      console.log("Le dessin doit avoir un nom ou doit avoir moins de 40 caractères!");
      console.log("nb de char:", this.name.length);
    }
  }

  onAlbumClick(album: IAlbum): void {
    this.selectedAlbum = album.name;
    console.log(album);
  }

  private getAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
}

}
