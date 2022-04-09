import { Component } from '@angular/core';
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

  constructor(public albumGalleryService: AlbumGalleryService) {
    this.name = "";
    this.description = "";
  }

  createAlbumButton(): void {
    if (this.isValidInput(this.name) && this.name.length < NAME_MAX_LENGTH) {
      this.albumGalleryService.createAlbum(this.name, this.description);
    } else {
      // TODO: UI feedback. Following line is temporary
      alert("L'album doit avoir un nom et posséder moins de 40 caractères.");
    }
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }

}
