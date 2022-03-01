import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '@app/interfaces-enums/IAlbum';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service'
import { CreateAlbumDialogComponent } from '@app/components/album-gallery/create-album-dialog/create-album-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-album-gallery',
  templateUrl: './album-gallery.component.html',
  styleUrls: ['./album-gallery.component.scss']
})
export class AlbumGalleryComponent implements OnInit {
  isOpened: boolean;

  constructor(public albumGalleryService: AlbumGalleryService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
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

    if(album != null) {
      this.albumGalleryService.currentAlbum = album;
    }
  }

  onChangePageButtonClick(value: boolean): void {
    this.isOpened = value;
  }

  onViewAllAlbumButton(): void {
    this.router.navigate(['../all-albums'], { relativeTo: this.route });
  }

  openSettingsDialog(): void {
    console.log("Open Settings dialog...");
  }

  leaveAlbumButton(): void {
    console.log("Leaving album");
    this.albumGalleryService.leaveAlbum(this.albumGalleryService.currentAlbum._id);
  }

  deleteAlbumButton(): void {
    console.log(`Deleted album id : ${this.albumGalleryService.currentAlbum._id}`);
    this.albumGalleryService.deleteAlbum(this.albumGalleryService.currentAlbum._id);
  }

  viewAllPublicAlbums(): void {
    this.albumGalleryService.fetchAllAlbumsFromDatabase();
  }

  viewMyAlbums(): void {
    this.albumGalleryService.fetchMyAlbumsFromDatabase();
  }

  ngOnDestroy(): void {
    this.albumGalleryService.myAlbums = []; // clear myAlbums array to avoid doubles when pushing elements
  }

}
