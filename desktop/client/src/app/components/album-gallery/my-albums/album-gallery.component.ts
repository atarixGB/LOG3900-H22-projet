import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service'
import { CreateAlbumDialogComponent } from '@app/components/album-gallery/create-album-dialog/create-album-dialog.component';
@Component({
  selector: 'app-album-gallery',
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit {
  isOpened: boolean;

  constructor(public albumGalleryService: AlbumGalleryService, public dialog: MatDialog) {
    this.isOpened = false;
  }

  ngOnInit(): void {
    this.viewMyAlbums();
  }

  openCreateAlbumDialog(): void {
    this.dialog.open(CreateAlbumDialogComponent);
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);
    this.isOpened = true;
    let id: string | undefined = album._id;
    this.albumGalleryService.currentAlbum = album;
    this.albumGalleryService.fetchDrawingsFromSelectedAlbum(id);
  }

  onChangePageButtonClick(value: boolean): void {
    this.isOpened = value;
  }

  openSettingsDialog(): void {
    console.log("Pop up pour modifier l'album...");
  }

  leaveAlbumButton(): void {
    console.log("On quitte l'album et on doit choisir un nouveau propriétaire")
  }

  viewAllPublicAlbums(): void {
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  deleteAlbumButton(album: IAlbum): void {
    this.albumGalleryService.deleteAlbum(album._id);
  }

  viewMyAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = []; // clear myAlbums array to avoid doubles when pushing elements
  }

}
