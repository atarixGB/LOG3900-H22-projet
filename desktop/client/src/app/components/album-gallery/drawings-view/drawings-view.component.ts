import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';

@Component({
  selector: 'app-drawings-view',
  templateUrl: './drawings-view.component.html',
  styleUrls: ['./drawings-view.component.scss']
})
export class DrawingsViewComponent {
@Output() backToAlbumPageEvent = new EventEmitter<boolean>();
@Output() changeViewNameEvent = new EventEmitter<string>();
@Input() albumName: string;

  constructor(public albumGalleryService: AlbumGalleryService) { }

  ngAfterViewInit(): void {
    // this.albumGalleryService.fetchDrawingsFromSelectedAlbum(album.id);

  }
  onChangePageButtonClick(): void {
    this.backToAlbumPageEvent.emit(false);
  }

}
