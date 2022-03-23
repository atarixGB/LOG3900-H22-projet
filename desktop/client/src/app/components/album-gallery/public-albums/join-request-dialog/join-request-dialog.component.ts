import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-join-request-dialog',
  templateUrl: './join-request-dialog.component.html',
  styleUrls: ['./join-request-dialog.component.scss']
})
export class JoinRequestDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IAlbum ,private albumGalleryService: AlbumGalleryService) {}

  ngOnInit(): void {
    console.log("join-request-dialog:", this.data)
  }

  onJoinAlbum(): void {
    this.albumGalleryService.currentAlbum = this.data;
    this.albumGalleryService.sendJoinAlbumRequest(this.data);
  }

}
