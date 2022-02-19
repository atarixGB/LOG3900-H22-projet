import { Component } from '@angular/core';
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

  constructor(public albumGalleryService: AlbumGalleryService) {
    this.name = "Mon album";
    this.description = "Mon super album!";
    this.isPrivate = false;
   }

  createAlbumButton(): void {
    console.log(`album created! ${this.name}, ${this.description}`);
    if (this.checkAlbumName()) {
      this.albumGalleryService.createAlbum(this.name, this.description, this.isPrivate);
    } else {
      // TODO: visual feedback in UI
    }
  }

  checkAlbumName(): boolean {
    // TODO: user input validation (no empty, no special character)
    return true;
  }

  changeAccess(value: number): void {
    console.log(value);
    this.isPrivate = value == 1;
  }

}
