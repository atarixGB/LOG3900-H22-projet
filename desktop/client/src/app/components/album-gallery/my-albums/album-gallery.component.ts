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

  constructor(public albumGalleryService: AlbumGalleryService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.viewMyAlbums();
  }

  openCreateAlbumDialog(): void {
    this.dialog.open(CreateAlbumDialogComponent);
  }

  onAlbumClick(album: IAlbum): void {
    console.log(album.name);

    if(album != null) {
      this.albumGalleryService.currentAlbum = album;
    }
  }

  onViewAllAlbumButton(): void {
    this.router.navigate(['../all-albums'], { relativeTo: this.route });
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
