import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { LoginService } from '@app/services/login/login.service';
import { RequestsDialogComponent } from './requests-dialog/requests-dialog.component';

@Component({
  selector: 'app-drawings-view',
  templateUrl: './drawings-view.component.html',
  styleUrls: ['./drawings-view.component.scss']
})
export class DrawingsViewComponent {
  @Output() backToAlbumPageEvent = new EventEmitter<boolean>();
  isCurrentAlbumMine: boolean;

  constructor(public albumGalleryService: AlbumGalleryService, public loginService: LoginService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog) {
    this.isCurrentAlbumMine = this.loginService.username == albumGalleryService.currentAlbum.owner;
    console.log("iscurrentalbummine:", this.isCurrentAlbumMine);
  }

  ngAfterViewInit(): void {
    this.albumGalleryService.fetchDrawingsFromSelectedAlbum(this.albumGalleryService.currentAlbum);
  }

  openSettingsDialog(): void {
    console.log("Open Settings dialog...");
  }

  viewRequests(): void {
    this.dialog.open(RequestsDialogComponent, {});
  }

  leaveAlbumButton(): void {
    console.log("Leaving album");
    this.albumGalleryService.leaveAlbum(this.albumGalleryService.currentAlbum);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  deleteAlbumButton(): void {
    console.log(`Deleted album id : ${this.albumGalleryService.currentAlbum._id}`);
    this.albumGalleryService.deleteAlbum(this.albumGalleryService.currentAlbum._id);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }
}
