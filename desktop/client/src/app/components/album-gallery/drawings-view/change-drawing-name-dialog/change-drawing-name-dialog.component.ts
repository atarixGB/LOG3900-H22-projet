import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { NAME_MAX_LENGTH } from '@app/constants/constants';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-change-drawing-name-dialog',
  templateUrl: './change-drawing-name-dialog.component.html',
  styleUrls: ['./change-drawing-name-dialog.component.scss']
})
export class ChangeDrawingNameDialogComponent {
  newDrawingName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDrawing , public albumGalleryService: AlbumGalleryService) { }

  changeDrawingName(): void {
    if (this.isValidInput(this.newDrawingName) && this.newDrawingName.length < NAME_MAX_LENGTH) {
      this.albumGalleryService.changeDrawingName(this.data, this.newDrawingName);
    } else {
      alert("Le nouveau nom du dessin doit posséder entre 1 et 40 caractères inclusivement")
    }
  }

  private isValidInput(str: string): boolean {
    return !(str === null || str.match(/^ *$/) !== null);
  }

}
