import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service'
import { CreateAlbumDialogComponent } from './create-album-dialog/create-album-dialog.component';
@Component({
  selector: 'app-album-gallery',
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit {

  constructor(private albumGalleryService: AlbumGalleryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllUserAlbums();
  }

  openCreateAlbumDialog(): void {
    console.log("open dialog");
   this.dialog.open(CreateAlbumDialogComponent, {
      // height: "50%",
      // width: "30%"
    });

  }

  deleteAlbumButton(): void {
    // TODO
  }

  viewAlbumButton(): void {
    // TODO
  }

  private getAllUserAlbums(): void {
    // TODO
    this.albumGalleryService.fetchAlbumsFromDatabase();
  }

}
