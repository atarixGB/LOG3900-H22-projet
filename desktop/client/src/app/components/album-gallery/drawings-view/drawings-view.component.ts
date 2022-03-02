import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-drawings-view',
  templateUrl: './drawings-view.component.html',
  styleUrls: ['./drawings-view.component.scss']
})
export class DrawingsViewComponent {
  @Output() backToAlbumPageEvent = new EventEmitter<boolean>();

  constructor(public albumGalleryService: AlbumGalleryService, private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.albumGalleryService.fetchDrawingsFromSelectedAlbum(this.albumGalleryService.currentAlbum);
  }

  openSettingsDialog(): void {
    console.log("Open Settings dialog...");
  }

  leaveAlbumButton(): void {
    console.log("Leaving album");
    this.albumGalleryService.leaveAlbum(this.albumGalleryService.currentAlbum._id);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }

  deleteAlbumButton(): void {
    console.log(`Deleted album id : ${this.albumGalleryService.currentAlbum._id}`);
    this.albumGalleryService.deleteAlbum(this.albumGalleryService.currentAlbum._id);
    this.router.navigate(['../my-albums'], { relativeTo: this.route });
  }
}
