import { Component } from '@angular/core';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-album-settings-dialog',
  templateUrl: './album-settings-dialog.component.html',
  styleUrls: ['./album-settings-dialog.component.scss']
})
export class AlbumSettingsDialogComponent {
  newAlbumName: string;
  newDescription: string;

  constructor(public albumGalleryService: AlbumGalleryService) {}

  modifyAlbum(): void {
    if (this.isValidInput(this.newAlbumName) && this.newAlbumName.length < NAME_MAX_LENGTH) {
      this.albumGalleryService.updateAlbumParameters(this.newAlbumName, this.newDescription);
    } else {
      alert("Le nouveau nom de l'album doit posséder entre 1 et 40 caractères inclusivement")
    }
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }

}
