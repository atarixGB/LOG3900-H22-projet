import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-change-drawing-name-dialog',
  templateUrl: './change-drawing-name-dialog.component.html',
  styleUrls: ['./change-drawing-name-dialog.component.scss']
})
export class ChangeDrawingNameDialogComponent implements OnInit {
  newDrawingName: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDrawing , public albumGalleryService: AlbumGalleryService) { }

  ngOnInit(): void {
    console.log(this.data);

  }

  changeDrawingName(): void {
    this.albumGalleryService.changeDrawingName(this.data, this.newDrawingName);
  }

}
