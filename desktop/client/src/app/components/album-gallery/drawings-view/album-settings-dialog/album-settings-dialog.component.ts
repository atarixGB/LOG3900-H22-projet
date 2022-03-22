import { Component } from '@angular/core';
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
    this.albumGalleryService.updateAlbumParameters(this.newAlbumName, this.newDescription);
  }

}
