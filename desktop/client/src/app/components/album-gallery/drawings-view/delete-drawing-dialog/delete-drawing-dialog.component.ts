import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDrawing } from '@app/interfaces-enums/IDrawing';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-delete-drawing-dialog',
  templateUrl: './delete-drawing-dialog.component.html',
  styleUrls: ['./delete-drawing-dialog.component.scss']
})
export class DeleteDrawingDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDrawing , public albumGalleryService: AlbumGalleryService) { }

  ngOnInit(): void {
  }

  deleteDrawing(): void {
    this.albumGalleryService.deleteDrawing(this.data);
  }

}
