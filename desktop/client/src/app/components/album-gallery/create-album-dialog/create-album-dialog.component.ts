import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-create-album-dialog',
  templateUrl: './create-album-dialog.component.html',
  styleUrls: ['./create-album-dialog.component.scss']
})
export class CreateAlbumDialogComponent {
  name: string;
  description: string;
  isPrivate: boolean;

  isEmpty: boolean;
  isValidLength: boolean;

  constructor(public albumGalleryService: AlbumGalleryService, private currentDialogRef: MatDialogRef<CreateAlbumDialogComponent>) {
    this.name = "Mon album";
    this.description = "";
    this.isValidInput(this.name);
  }

  createAlbumButton(): void {
    if (this.isValidInput(this.name)) {
      this.albumGalleryService.createAlbum(this.name, this.description);
      this.currentDialogRef.close();
    }
  }

  private isValidInput(str: string): boolean {
    this.isEmpty = (str === null || str.match(/^ *$/) !== null);
    this.isValidLength = str.length <= NAME_MAX_LENGTH;
    return !this.isEmpty && this.isValidLength;
}

}
