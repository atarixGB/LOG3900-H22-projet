import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service'
import { CreateAlbumDialogComponent } from './create-album-dialog/create-album-dialog.component';
@Component({
  selector: 'app-album-gallery',
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit {

  constructor(public albumGalleryService: AlbumGalleryService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.viewMyAlbums();
  }

  openCreateAlbumDialog(): void {
    this.dialog.open(CreateAlbumDialogComponent);
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);
    let id: string | undefined = album._id;
    this.albumGalleryService.fetchDrawingsFromSelectedAlbum(id);
  }

  viewAllPublicAlbums(): void {
    console.log("viewing all albums...")
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  deleteAlbumButton(album: IAlbum): void {
    this.albumGalleryService.deleteAlbum(album._id);
  }

   viewMyAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }


}
